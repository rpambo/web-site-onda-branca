package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/rpambo/web-site-onda-branca/internal/mailer"
	"github.com/rpambo/web-site-onda-branca/types"
)

// SubmitEmailHandler godoc
// @Summary     Envia confirmação de pedido de brochura
// @Description Recebe apenas o email do cliente, envia um email de confirmação para ele e uma notificação para a equipa da Onda Branca
// @Tags        brochures
// @Accept      json
// @Produce     json
// @Param       payload body  types.Bruchura true "Email do cliente"
// @Success     200 {object} map[string]string "Mensagem de sucesso"
// @Failure     400 {object} map[string]string "Erro de requisição inválida"
// @Failure     429 {object} map[string]string "Muitas requisições"
// @Failure     500 {object} map[string]string "Erro interno do servidor"
// @Router      /v1/brochura/email [post]
func (app *application) SubmitEmailHandler(w http.ResponseWriter, r *http.Request) {
	ip := r.RemoteAddr

	// Limite de requisições
	allowed, retryAfter := app.ratelimiter.Allow(ip)
	if !allowed {
		w.Header().Set("Retry-After", fmt.Sprintf("%.f", retryAfter.Seconds()))
		http.Error(w, "Too Many Requests", http.StatusTooManyRequests)
		return
	}

	var payload types.Bruchura
	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if payload.Email == "" {
		app.badRequestResponse(w, r, fmt.Errorf("email é obrigatório"))
		return
	}

	isProdEnv := app.config.env == "production"

	// --- 1) Email de confirmação para o cliente ---
	clientVars := struct {
		Email string
		Year  string
	}{
		Email: payload.Email,
		Year:  time.Now().Format("02/01/2006 15:04"),
	}

	status, err := app.mailer.Send(mailer.Bruchura, payload.Email, payload.Email, clientVars, !isProdEnv)
	if err != nil {
		app.logger.Errorw("erro ao enviar email ao cliente", "error", err)
		app.internalServerError(w, r, err)
		return
	}
	app.logger.Info("Email para cliente enviado", "status", status)

	// --- 2) Notificação interna para a equipa ---
	teamVars := struct {
		Email string
		Data  string
	}{
		Email: payload.Email,
		Data:  time.Now().Format("02/01/2006 15:04"),
	}

	teamEmail := "suporte@ondabranca.com"
	status, err = app.mailer.Send(mailer.TeamNotificationTemplate, "Equipa Onda Branca", teamEmail, teamVars, !isProdEnv)
	if err != nil {
		app.logger.Errorw("erro ao enviar email para a equipa", "error", err)
		app.internalServerError(w, r, err)
		return
	}
	app.logger.Info("Email para a equipa enviado", "status", status)

	// --- 3) Resposta JSON ---
	app.jsonResponse(w, http.StatusOK, map[string]string{
		"message": "Email recebido com sucesso!",
	})
}