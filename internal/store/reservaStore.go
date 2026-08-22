package store

import (
	"context"
	"database/sql" 

	"github.com/rpambo/web-site-onda-branca/types"
)


type ReservaStorage struct {
	db *sql.DB
}

func (s *ReservaStorage) CreateTx(ctx context.Context, tx *sql.Tx, r *types.ReservaEvento) error {

	query := `
		INSERT INTO reserva_eventos (
			id, nome, email, telefone, empresa,
			tipo_interesse, tipo_evento, participantes,
			coffee_break_incluido, coffee_break_tipo, coffee_break_pessoas,
			necessidades, mensagem, token , status, criado_em
		)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
	`

	_, err := tx.ExecContext(
		ctx,
		query,
		r.ID,
		r.Nome,
		r.Email,
		r.Telefone,
		r.Empresa,
		r.TipoInteresse,
		r.TipoEvento,
		r.Participantes,
		r.CoffeeBreak.Incluido,
		r.CoffeeBreak.Tipo,
		r.CoffeeBreak.Pessoas,
		r.Necessidades,
		r.Mensagem,
		r.Token,
		r.Status,
		r.CriadoEm,
	)

	return err
}

func (s *ReservaStorage) GetByID(ctx context.Context, id string) (*types.ReservaEvento, error) {

	query := `
	SELECT
		id,
		nome,
		email,
		telefone,
		empresa,
		tipo_interesse,
		tipo_evento,
		participantes,
		coffee_break_incluido,
		coffee_break_tipo,
		coffee_break_pessoas,
		necessidades,
		mensagem,
		status,
		criado_em,
		token
	FROM reserva_eventos
	WHERE id = $1
	`

	var r types.ReservaEvento

	err := s.db.QueryRowContext(ctx, query, id).Scan(
		&r.ID,
		&r.Nome,
		&r.Email,
		&r.Telefone,
		&r.Empresa,
		&r.TipoInteresse,
		&r.TipoEvento,
		&r.Participantes,
		&r.CoffeeBreak.Incluido,
		&r.CoffeeBreak.Tipo,
		&r.CoffeeBreak.Pessoas,
		&r.Necessidades,
		&r.Mensagem,
		&r.Status,
		&r.CriadoEm,
		&r.Token,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}

	return &r, nil
}

func (s *ReservaStorage) UpdateStatus( ctx context.Context, id string, status types.StatusReserva ) error {

	query := `
	UPDATE reserva_eventos
	SET status = $1
	WHERE id = $2
	`

	_, err := s.db.ExecContext(
		ctx,
		query,
		status,
		id,
	)

	return err
}