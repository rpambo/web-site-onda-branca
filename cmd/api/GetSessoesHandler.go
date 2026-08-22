package main

import (
	"net/http"

	"github.com/rpambo/web-site-onda-branca/types"
)

// GetSessoesHandler godoc
// @Summary      Listar sessões reservadas
// @Description  Retorna todas as sessões reservadas para bloqueio no calendário
// @Tags         reserva-evento
// @Produce      json
// @Success      200 {object} map[string]interface{}
// @Failure      500 {object} map[string]string
// @Router       /v1/reserva-evento/sessoes [get]
func (app *application) GetSessoesHandler(w http.ResponseWriter, r *http.Request) {

	sessoes, err := app.store.SessaoStorage.GetAllConfirmed(r.Context())
	if err != nil {
		app.logger.Errorw("error fetching sessoes", "error", err)
		app.internalServerError(w, r, err)
		return
	}

	response := struct {
		Data []types.SessaoEvento `json:"data"`
	}{
		Data: sessoes,
	}

	_ = app.jsonResponse(w, http.StatusOK, response)
}