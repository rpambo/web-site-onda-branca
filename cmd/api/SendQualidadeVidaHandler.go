package main

import (
    "fmt"
    "net/http"
    "time"

    "github.com/rpambo/web-site-onda-branca/internal/mailer"
    "github.com/rpambo/web-site-onda-branca/types"
)


// SendQualidadeVidaHandler godoc
// @Summary     Inscrição no Projeto de Qualidade de Vida
// @Description Recebe dados do participante e envia emails
// @Tags        qualidade-vida
// @Accept      json
// @Produce     json
// @Param       payload body types.QualidadeVida true "Dados do participante"
// @Success     200 {object} types.QualidadeVida
// @Failure     400 {object} map[string]string
// @Failure     500 {object} map[string]string
// @Router      /v1/qualidade-vida/email [post]
func (app *application) SendQualidadeVidaHandler(w http.ResponseWriter, r *http.Request) {
	ip := r.RemoteAddr

	allowed, retryAfter := app.ratelimiter.Allow(ip)
	if !allowed {
		w.Header().Set("Retry-After", fmt.Sprintf("%.f", retryAfter.Seconds()))
		http.Error(w, "Too Many Requests", http.StatusTooManyRequests)
		return
	}

	var payload types.QualidadeVida

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
		Name            string
		Email           string
		Contact         string
		Age             *int
		AreasInterest   string
		PersonalGoal    string
		Frequencia      string
		ExperiencePrior string
		Message         string
		Data            string
	}{
		Name:            payload.Name,
		Email:           payload.Email,
		Contact:         payload.Contact,
		Age:             payload.Age,
		AreasInterest:   payload.AreasInterest,
		PersonalGoal:    payload.PersonalGoal,
		Frequencia:      payload.Frequencia,
		ExperiencePrior: payload.ExperiencePrior,
		Message:         payload.Message,
		Data:            now,
	}

	status, err := app.mailer.Send(
		mailer.QualidadeVidaClientTemplate,
		payload.Name,
		payload.Email,
		clientVars,
		!isProdEnv,
	)
	if err != nil {
		app.logger.Errorw("error sending qualidade vida client email", "error", err)
		app.internalServerError(w, r, err)
		return
	}

	app.logger.Info("Client email sent", "status code", status)

	// ───────── EMAIL EQUIPA ─────────
	salesVars := clientVars

	status, err = app.mailer.Send(
		mailer.QualidadeVidaSalesTemplate,
		"Equipa Onda Branca",
		"geral@ondabrancaangola.com",
		salesVars,
		!isProdEnv,
	)
	if err != nil {
		app.logger.Errorw("error sending qualidade vida sales email", "error", err)
		app.internalServerError(w, r, err)
		return
	}

	app.logger.Info("Sales email sent", "status code", status)

	// ───────── RESPONSE ─────────
	if err := app.jsonResponse(w, http.StatusOK, payload); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}