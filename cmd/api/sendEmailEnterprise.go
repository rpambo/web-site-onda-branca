package main

import (
	"net/http"
	"time"

	"github.com/rpambo/web-site-onda-branca/internal/mailer"
	"github.com/rpambo/web-site-onda-branca/types"
)

// SendEmailEnterprises godoc
// @Summary     Send enterprise email
// @Description Recebe dados de uma empresa e envia um email de boas-vindas
// @Tags        enterprises
// @Accept      json
// @Produce     json
// @Param       payload body types.InfoEmpresa true "Enterprise Info"
// @Success     200 {object} types.InfoEmpresa
// @Failure     400 {object} map[string]string
// @Failure     500 {object} map[string]string
// @Router      v1/enterprises/email [post]
func (app *application) SendEmailEnterprises(w http.ResponseWriter, r *http.Request) {
    var payload types.InfoEmpresa

    if err := readJSON(w, r, &payload); err != nil {
        app.badRequestResponse(w, r, err)
        return
    }

    isProdEnv := app.config.env == "production"
    vars := struct {
        Name  string
        Email string
		Servico	string
		Year	int
    }{
        Name:  payload.Name,
        Email: payload.Email,
		Servico: payload.Servico,
		Year: time.Now().Year(),
    }

    if err := Validate.Struct(payload); err != nil {
        app.badRequestResponse(w, r, err)
        return
    }

    status, err := app.mailer.Send(mailer.UserWelcomeTemplate, payload.Name, payload.Email, vars, !isProdEnv)
    if err != nil {
        app.logger.Errorw("error sending welcome email", "error", err)
        app.internalServerError(w, r, err)
        return
    }

    app.logger.Info("Email sent", "status code", status)

    if err := app.jsonResponse(w, http.StatusOK, payload); err != nil {
        app.internalServerError(w, r, err)
        return
    }
}