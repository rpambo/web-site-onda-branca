package main

import (
    "fmt"
    "net/http"
    "time"

    "github.com/rpambo/web-site-onda-branca/internal/mailer"
    "github.com/rpambo/web-site-onda-branca/types"
)

// SendProgramaSaudeMentalHandler godoc
// @Summary     Envia email do Programa de Saúde Mental do Trabalhador
// @Description Recebe dados da empresa, envia confirmação ao cliente e notificação à equipa
// @Tags        saude-mental
// @Accept      json
// @Produce     json
// @Param       payload body types.ProgramaSaudeMentalTrabalhador true "Dados do programa"
// @Success     200 {object} types.ProgramaSaudeMentalTrabalhador
// @Failure     400 {object} map[string]string
// @Failure     500 {object} map[string]string
// @Router      /v1/saude-mental/email [post]
func (app *application) SendProgramaSaudeMentalHandler(w http.ResponseWriter, r *http.Request) {
    ip := r.RemoteAddr

    allowed, retryAfter := app.ratelimiter.Allow(ip)
    if !allowed {
        w.Header().Set("Retry-After", fmt.Sprintf("%.f", retryAfter.Seconds()))
        http.Error(w, "Too Many Requests", http.StatusTooManyRequests)
        return
    }

    var payload types.ProgramaSaudeMentalTrabalhador

    if err := readJSON(w, r, &payload); err != nil {
        app.badRequestResponse(w, r, err)
        return
    }

    if err := Validate.Struct(payload); err != nil {
        app.badRequestResponse(w, r, err)
        return
    }

    isProdEnv := app.config.env == "production"

    // 1) Confirmação para o cliente
    clientVars := struct {
        Name              string
        Email             string
        Contact           string
        Company           string
        NumberOfEmployees int
        ServiceType       string
        Year              string
    }{
        Name:              payload.Name,
        Email:             payload.Email,
        Contact:           payload.Contact,
        Company:           payload.Company,
        NumberOfEmployees: payload.NumberOfEmployees,
        ServiceType:       payload.ServiceType,
        Year:              time.Now().Format("02/01/2006 15:04"),
    }

    status, err := app.mailer.Send(
        mailer.SaudeMentalClientTemplate, // template de confirmação ao cliente
        payload.Name,
        payload.Email,
        clientVars,
        !isProdEnv,
    )
    if err != nil {
        app.logger.Errorw("error sending saude mental client email", "error", err)
        app.internalServerError(w, r, err)
        return
    }
    app.logger.Info("Email sent", "status code", status)

    // 2) Notificação para a equipa
    salesVars := struct {
        Cliente           string
        Email             string
        Contact           string
        Company           string
        NumberOfEmployees int
        ServiceType       string
        SpecificNeeds     string
        Message           string
        Data              string
    }{
        Cliente:           payload.Name,
        Email:             payload.Email,
        Contact:           payload.Contact,
        Company:           payload.Company,
        NumberOfEmployees: payload.NumberOfEmployees,
        ServiceType:       payload.ServiceType,
        SpecificNeeds:     payload.SpecificNeeds,
        Message:           payload.Message,
        Data:              time.Now().Format("02/01/2006 15:04"),
    }

    salesEmail := "rkitoco@gmail.com" // <- trocar pelo email da equipa
    status, err = app.mailer.Send(
        mailer.SaudeMentalSalesTemplate, // template de notificação à equipa
        "Equipa de Vendas",
        salesEmail,
        salesVars,
        !isProdEnv,
    )
    if err != nil {
        app.logger.Errorw("error sending saude mental sales email", "error", err)
        app.internalServerError(w, r, err)
        return
    }
    app.logger.Info("Email sent", "status code", status)

    // 3) Resposta HTTP
    if err := app.jsonResponse(w, http.StatusOK, payload); err != nil {
        app.internalServerError(w, r, err)
        return
    }
}