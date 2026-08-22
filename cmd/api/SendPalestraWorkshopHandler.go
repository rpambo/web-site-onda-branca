package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/rpambo/web-site-onda-branca/internal/mailer"
	"github.com/rpambo/web-site-onda-branca/types"
)

// SendPalestraWorkshopHandler godoc
// @Summary     Solicitação de Palestra ou Workshop
// @Description Recebe dados do formulário de palestras e workshops e envia emails para cliente e equipa
// @Tags        palestras-workshops
// @Accept      json
// @Produce     json
// @Param       payload body types.PalestraWorkshop true "Dados da palestra ou workshop"
// @Success     200 {object} types.PalestraWorkshop
// @Failure     400 {object} map[string]string
// @Failure     429 {object} map[string]string
// @Failure     500 {object} map[string]string
// @Router      /v1/palestras-workshops/email [post]
func (app *application) SendPalestraWorkshopHandler(w http.ResponseWriter, r *http.Request) {
	ip := r.RemoteAddr

	allowed, retryAfter := app.ratelimiter.Allow(ip)
	if !allowed {
		w.Header().Set("Retry-After", fmt.Sprintf("%.f", retryAfter.Seconds()))
		http.Error(w, "Too Many Requests", http.StatusTooManyRequests)
		return
	}

	var payload types.PalestraWorkshop

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
		Name         string
		Email        string
		Contact      string
		Company      string
		EventType    string
		Topic        string
		AudienceSize int
		Location     string
		EventDate    string
		Objective    string
		Message      string
		Data         string
	}{
		Name:         payload.Name,
		Email:        payload.Email,
		Contact:      payload.Contact,
		Company:      payload.Company,
		EventType:    payload.EventType,
		Topic:        payload.Topic,
		AudienceSize: payload.AudienceSize,
		Location:     payload.Location,
		EventDate:    payload.EventDate,
		Objective:    payload.Objective,
		Message:      payload.Message,
		Data:         now,
	}

	status, err := app.mailer.Send(
		mailer.PalestraWorkshopClientTemplate,
		payload.Name,
		payload.Email,
		clientVars,
		!isProdEnv,
	)
	if err != nil {
		app.logger.Errorw("error sending palestra client email", "error", err)
		app.internalServerError(w, r, err)
		return
	}

	app.logger.Info("Client email sent", "status code", status)

	// ───────── EMAIL EQUIPA ─────────
	salesVars := clientVars

	status, err = app.mailer.Send(
		mailer.PalestraWorkshopSalesTemplate,
		"Equipa Onda Branca",
		"rkitoco@gmail.com",
		salesVars,
		!isProdEnv,
	)
	if err != nil {
		app.logger.Errorw("error sending palestra sales email", "error", err)
		app.internalServerError(w, r, err)
		return
	}

	app.logger.Info("Sales email sent", "status code", status)

	// ───────── RESPONSE ─────────
	_ = app.jsonResponse(w, http.StatusOK, payload)
}