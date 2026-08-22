package main

import (
    "fmt"
    "net/http"
    "time"

    "github.com/rpambo/web-site-onda-branca/internal/mailer"
    "github.com/rpambo/web-site-onda-branca/types"
)

// SendGinasticaLaboralHandler godoc
// @Summary     Solicitação de Ginástica Laboral
// @Description Recebe dados do formulário de ginástica laboral e envia emails para cliente e equipa
// @Tags        ginastica-laboral
// @Accept      json
// @Produce     json
// @Param       payload body types.GinasticaLaboral true "Dados da ginástica laboral"
// @Success     200 {object} types.GinasticaLaboral
// @Failure     400 {object} map[string]string
// @Failure     429 {object} map[string]string
// @Failure     500 {object} map[string]string
// @Router      /v1/ginastica-laboral/email [post]
func (app *application) SendGinasticaLaboralHandler(w http.ResponseWriter, r *http.Request) {
	ip := r.RemoteAddr

	allowed, retryAfter := app.ratelimiter.Allow(ip)
	if !allowed {
		w.Header().Set("Retry-After", fmt.Sprintf("%.f", retryAfter.Seconds()))
		http.Error(w, "Too Many Requests", http.StatusTooManyRequests)
		return
	}

	var payload types.GinasticaLaboral

	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	isProdEnv := app.config.env == "production"
	now := time.Now().Format("02/01/2006 15:04")

	// ───────── EMAIL CLIENTE ─────────
	clientVars := struct {
		Name               string
		Email              string
		Telefone           string
		Empresa            string
		NumeroFuncionarios int
		Area               string
		AtividadePreferida string
		Objetivos          string
		Frequencia         string
		Mensagem           string
		Data               string
	}{
		Name:               payload.Name,
		Email:              payload.Email,
		Telefone:           payload.Telefone,
		Empresa:            payload.Empresa,
		NumeroFuncionarios: payload.NumeroFuncionarios,
		Area:               payload.Area,
		AtividadePreferida: payload.AtividadePreferida,
		Objetivos:          payload.Objetivos,
		Frequencia:         payload.Frequencia,
		Mensagem:           payload.Mensagem,
		Data:               now,
	}

	status, err := app.mailer.Send(
		mailer.GinasticaClientTemplate,
		payload.Name,
		payload.Email,
		clientVars,
		!isProdEnv,
	)
	if err != nil {
		app.logger.Errorw("error sending ginastica client email", "error", err)
		app.internalServerError(w, r, err)
		return
	}

	app.logger.Info("Client email sent", "status code", status)

	// ───────── EMAIL EQUIPA ─────────
	salesVars := clientVars

	status, err = app.mailer.Send(
		mailer.GinasticaSalesTemplate,
		"Equipa Onda Branca",
		"rkitoco@gmail.com",
		salesVars,
		!isProdEnv,
	)
	if err != nil {
		app.logger.Errorw("error sending ginastica sales email", "error", err)
		app.internalServerError(w, r, err)
		return
	}

	app.logger.Info("Sales email sent", "status code", status)

	// ───────── RESPONSE ─────────
	_ = app.jsonResponse(w, http.StatusOK, payload)
}