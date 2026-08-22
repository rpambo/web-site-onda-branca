package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/rpambo/web-site-onda-branca/internal/mailer"
	"github.com/rpambo/web-site-onda-branca/types"
)

// CreateReservaEventoHandler godoc
// @Summary      Criar reserva de evento
// @Description  Recebe um pedido de reserva de evento
// @Tags         reserva-evento
// @Accept       json
// @Produce      json
// @Param        payload body types.ReservaEvento true "Dados da reserva de evento"
// @Success      201 {object} types.ReservaEvento
// @Failure      400 {object} map[string]string
// @Failure      429 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /v1/reserva-evento/criar-reserva [post]
func (app *application) CreateReservaEventoHandler(w http.ResponseWriter, r *http.Request) {

	ip := r.RemoteAddr

	// RATE LIMIT
	allowed, retryAfter := app.ratelimiter.Allow(ip)
	if !allowed {
		w.Header().Set("Retry-After", fmt.Sprintf("%.f", retryAfter.Seconds()))
		http.Error(w, "Too Many Requests", http.StatusTooManyRequests)
		return
	}

	// PARSE
	var req types.ReservaEvento
	if err := readJSON(w, r, &req); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	// VALIDATE
	if err := Validate.Struct(req); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	// ENRIQUECER
	id := uuid.NewString()
	token := uuid.NewString()

	req.ID = id
	req.Token = token
	req.Status = types.StatusPendente 
	req.CriadoEm = time.Now()

	baseURL := "http://localhost:8080/v1/reserva-evento"
	req.ConfirmURL = baseURL + "/" + id + "/confirmar?token=" + token
	req.CancelURL = baseURL + "/" + id + "/cancelar?token=" + token

	// TRANSAÇÃO
	tx, err := app.store.BeginTx(r.Context())
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}
	defer tx.Rollback()

	// INSERT RESERVA
	if err := app.store.ReservaStorage.CreateTx(r.Context(), tx, &req); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	// INSERT DATAS
	for _, data := range req.Datas {
		if err := app.store.SessaoStorage.CreateTx(r.Context(), tx, id, data); err != nil {
			app.internalServerError(w, r, err)
			return
		}
	}

	// COMMIT
	if err := tx.Commit(); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	// EMAIL (fora da transação)
	isProd := app.config.env == "production"

	if _, err := app.mailer.Send(
		mailer.ReservaEquipeTemplate,
		"Equipa Onda Branca",
		"rkitoco@gmail.com",
		req,
		!isProd,
	); err != nil {
		app.logger.Errorw("email failed after commit", "error", err)
	}

	// RESPONSE
	_ = app.jsonResponse(w, http.StatusCreated, req)
}