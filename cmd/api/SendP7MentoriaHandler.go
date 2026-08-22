package main

import (
    "fmt"
    "net/http"
    "time"

    "github.com/rpambo/web-site-onda-branca/internal/mailer"
    "github.com/rpambo/web-site-onda-branca/types"
)

// SendP7MentoriaHandler godoc
// @Summary     Solicitação de Mentoria P7
// @Description Recebe dados da mentoria e envia emails
// @Tags        mentoria
// @Accept      json
// @Produce     json
// @Param       payload body types.P7Mentoria true "Dados da mentoria"
// @Success     200 {object} types.P7Mentoria
// @Failure     400 {object} map[string]string
// @Failure     500 {object} map[string]string
// @Router      /v1/mentoria/email [post]
func (app *application) SendP7MentoriaHandler(w http.ResponseWriter, r *http.Request) {
	ip := r.RemoteAddr

	allowed, retryAfter := app.ratelimiter.Allow(ip)
	if !allowed {
		w.Header().Set("Retry-After", fmt.Sprintf("%.f", retryAfter.Seconds()))
		http.Error(w, "Too Many Requests", http.StatusTooManyRequests)
		return
	}

	var payload types.P7Mentoria

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
		ParticipantType string
		Company         string
		MainChallenges  string
		MentoriaGoals   string
		Availability    string
		Message         string
		Data            string
	}{
		Name:            payload.Name,
		Email:           payload.Email,
		Contact:         payload.Contact,
		ParticipantType: payload.ParticipantType,
		Company:         payload.Company,
		MainChallenges:  payload.MainChallenges,
		MentoriaGoals:   payload.MentoriaGoals,
		Availability:    payload.Availability,
		Message:         payload.Message,
		Data:            now,
	}

	status, err := app.mailer.Send(
		mailer.MentoriaClientTemplate,
		payload.Name,
		payload.Email,
		clientVars,
		!isProdEnv,
	)
	if err != nil {
		app.logger.Errorw("error sending mentoria client email", "error", err)
		app.internalServerError(w, r, err)
		return
	}

	app.logger.Info("Client email sent", "status code", status)

	// ───────── EMAIL EQUIPA ─────────
	salesVars := clientVars // reutiliza tudo

	status, err = app.mailer.Send(
		mailer.MentoriaSalesTemplate,
		"Equipa P7",
		"geral@ondabrancaangola.com",
		salesVars,
		!isProdEnv,
	)
	if err != nil {
		app.logger.Errorw("error sending mentoria sales email", "error", err)
		app.internalServerError(w, r, err)
		return
	}

	app.logger.Info("Sales email sent", "status code", status)

	// ───────── RESPONSE ─────────
	_ = app.jsonResponse(w, http.StatusOK, payload)
}