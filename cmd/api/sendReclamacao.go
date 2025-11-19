package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/rpambo/web-site-onda-branca/internal/mailer"
	"github.com/rpambo/web-site-onda-branca/types"
)

// SendComplaint godoc
// @Summary     Envia reclamação do cliente
// @Description Recebe uma reclamação e envia email de confirmação para o cliente e notificação para a equipa de suporte
// @Tags        complaints
// @Accept      json
// @Produce     json
// @Param       payload body types.ComplaintPayload true "Complaint Info"
// @Success     200 {object} types.ComplaintPayload
// @Failure     400 {object} map[string]string
// @Failure     500 {object} map[string]string
// @Router      /v1/complaints/email [post]
func (app *application) SendComplaint(w http.ResponseWriter, r *http.Request) {
    ip := r.RemoteAddr

    allowed, retryAfter := app.ratelimiter.Allow(ip)
    if !allowed {
        w.Header().Set("Retry-After", fmt.Sprintf("%.f", retryAfter.Seconds()))
        http.Error(w, "Too Many Requests", http.StatusTooManyRequests)
        return
    }

    var payload types.ComplaintPayload

    if err := readJSON(w, r, &payload); err != nil {
        app.badRequestResponse(w, r, err)
        return
    }

    if err := Validate.Struct(payload); err != nil {
        app.badRequestResponse(w, r, err)
        return
    }

    isProdEnv := app.config.env == "production"

    // Variáveis para o email do cliente
    clientVars := struct {
        Name  string
        Email string
        Message string
        Year int
    }{
        Name:    payload.Name,
        Email:   payload.Email,
        Message: payload.Message,
        Year:    time.Now().Year(),
    }

    // Enviar email para o cliente confirmando recepção da reclamação
    status, err := app.mailer.Send(
        mailer.UserComplaintReceivedTemplate,
        payload.Name,
        payload.Email,
        clientVars,
        !isProdEnv,
    )
    if err != nil {
        app.logger.Errorw("error sending client complaint email", "error", err)
        app.internalServerError(w, r, err)
        return
    }
    
	app.logger.Info("Email sent", "status code", status)

	// Variáveis para a equipa de suporte
    supportVars := struct {
        Cliente string
        Email   string
        Message string
        Data    string
    }{
        Cliente:  payload.Name,
        Email:    payload.Email,
        Message: payload.Message,
        Data:     time.Now().Format("02/01/2006 15:04"),
    }

    supportEmail := "rafaelgeniokitoco@gmail.com"

    status, err = app.mailer.Send(
        mailer.SupportTeamComplaintTemplate,
        "Equipa de Suporte",
        supportEmail,
        supportVars,
        !isProdEnv,
    )

	app.logger.Info("Email sent", "status code", status)

    if err != nil {
        app.logger.Errorw("error sending support complaint email", "error", err)
        app.internalServerError(w, r, err)
        return
    }

    if err := app.jsonResponse(w, http.StatusOK, payload); err != nil {
        app.internalServerError(w, r, err)
        return
    }
}