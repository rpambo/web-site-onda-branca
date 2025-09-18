package main

import (
	"net/http"
)


// healthcheckHandler godoc
//
//	@Summary		Healthcheck
//	@Description	Healthcheck endpoint
//	@Tags			ops
//	@Produce		json
//	@Success		200	{object}	string	"ok"
//	@Router			/health [get]
func (app *application) HealthHandle(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Ok!!"))
}