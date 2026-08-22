package main

import (
	"errors"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/rpambo/web-site-onda-branca/internal/mailer"
	"github.com/rpambo/web-site-onda-branca/types"
)

// UpdateReservaEventoStatusHandler godoc
//
// @Summary      Confirmar reserva
// @Description  Confirma uma reserva através do link enviado por e-mail.
// @Tags         reserva-evento
// @Produce      json
// @Param        id     path   string true "ID da reserva"
// @Param        token  query  string true "Token de confirmação"
// @Success      200 {object} map[string]string
// @Failure      400 {object} map[string]string
// @Failure      401 {object} map[string]string
// @Failure      404 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /v1/reserva-evento/{id}/confirmar [get]
func (app *application) ConfirmReservaEventoHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	token := r.URL.Query().Get("token")

	frontendURL := app.config.frontendURL

	if token == "" {
		http.Redirect(
			w,
			r,
			frontendURL+"/reserva/invalida",
			http.StatusSeeOther,
		)
		return
	}

	// Buscar reserva
	reserva, err := app.store.ReservaStorage.GetByID(r.Context(), id)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if reserva == nil {
		http.Redirect(
			w,
			r,
			frontendURL+"/reserva/invalida",
			http.StatusSeeOther,
		)
		return
	}

	// Validar token
	if reserva.Token != token {
		http.Redirect(
			w,
			r,
			frontendURL+"/reserva/invalida",
			http.StatusSeeOther,
		)
		return
	}

	// Já confirmada
	if reserva.Status == types.StatusConfirmada {
		http.Redirect(
			w,
			r,
			frontendURL+"/reserva/confirmada",
			http.StatusSeeOther,
		)
		return
	}

	// Atualizar status
	err = app.store.ReservaStorage.UpdateStatus(
		r.Context(),
		id,
		types.StatusConfirmada,
	)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	// Buscar datas da reserva
	datas, err := app.store.SessaoStorage.GetByReservaID(r.Context(), id)
	if err != nil {
		app.logger.Errorw("error fetching datas", "error", err)
	}

	formatted := make([]string, 0, len(datas))

	for _, d := range datas {
		t, err := time.Parse(time.RFC3339, d)
		if err != nil {
			formatted = append(formatted, d)
			continue
		}

		formatted = append(formatted, t.Format("02/01/2006"))
	}

	reserva.Datas = formatted
	reserva.Status = types.StatusConfirmada

	// Enviar e-mail ao cliente
	isProd := app.config.env == "production"

	if _, err := app.mailer.Send(
		mailer.ReservaClienteTemplate,
		"Onda Branca",
		reserva.Email,
		reserva,
		!isProd,
	); err != nil {
		app.logger.Errorw(
			"error sending confirmation email",
			"error", err,
		)
	}

	// Redirecionar para o Angular
	http.Redirect(
		w,
		r,
		frontendURL+"/reserva/confirmada",
		http.StatusSeeOther,
	)
}

// UpdateReservaEventoStatusHandler godoc
//
//	@Summary		Cancelar reserva de evento
//	@Description	Valida o token, remove a reserva e envia um e-mail de cancelamento ao cliente.
//	@Tags			reserva-evento
//	@Produce		json
//	@Param			id		path		string	true	"ID da Reserva"
//	@Param			token	query		string	true	"Token de confirmação"
//	@Success		200		{object}	map[string]string
//	@Failure		400		{object}	map[string]string
//	@Failure		401		{object}	map[string]string
//	@Failure		404		{object}	map[string]string
//	@Failure		500		{object}	map[string]string
//	@Router			/v1/reserva-evento/{id}/cancelar [get]
func (app *application) CancelReservaEventoHandler(w http.ResponseWriter, r *http.Request) {

	id := chi.URLParam(r, "id")
	token := r.URL.Query().Get("token")

	if token == "" {
		app.badRequestResponse(w, r, errors.New("token obrigatório"))
		return
	}

	// Buscar reserva
	reserva, err := app.store.ReservaStorage.GetByID(r.Context(), id)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if reserva == nil {
		http.NotFound(w, r)
		return
	}

	// Validar token
	if reserva.Token != token {
		http.Error(w, "Token inválido", http.StatusUnauthorized)
		return
	}

	// já cancelada
	if reserva.Status == types.StatusCancelada {
		_ = app.jsonResponse(w, http.StatusOK, map[string]string{
			"message": "Reserva já cancelada.",
		})
		return
	}

	// atualizar status no DB
	err = app.store.ReservaStorage.UpdateStatus(
		r.Context(),
		id,
		types.StatusCancelada,
	)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	// atualizar estado em memória para email
	reserva.Status = types.StatusCancelada

	// BUSCAR DATAS (opcional, mas consistente com confirm)
	datas, err := app.store.SessaoStorage.GetByReservaID(r.Context(), id)
	if err != nil {
		app.logger.Errorw("error fetching datas", "error", err)
	}

	formatted := make([]string, 0, len(datas))

	for _, d := range datas {
		t, err := time.Parse(time.RFC3339, d)
		if err != nil {
			formatted = append(formatted, d)
			continue
		}
		formatted = append(formatted, t.Format("02/01/2006"))
	}

	reserva.Datas = formatted

	// EMAIL AO CLIENTE
	isProd := app.config.env == "production"

	if _, err := app.mailer.Send(
		mailer.ReservaCanceladaClienteTemplate,
		"Onda Branca",
		reserva.Email,
		reserva,
		!isProd,
	); err != nil {
		app.logger.Errorw(
			"error sending cancellation email",
			"error", err,
		)
	}

	_ = app.jsonResponse(w, http.StatusOK, map[string]string{
		"message": "Reserva cancelada com sucesso.",
	})
}