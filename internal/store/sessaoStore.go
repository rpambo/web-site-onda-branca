package store

import (
	"context"
	"database/sql" 

	"github.com/rpambo/web-site-onda-branca/types"
)


type SessaoStorage struct {
	db *sql.DB
}

func (s *SessaoStorage) CreateTx(ctx context.Context, tx *sql.Tx, reservaID string, data string) error {

	query := `
		INSERT INTO sessoes_evento (
			reserva_evento_id,
			data,
			criado_em
		)
		VALUES ($1, $2, NOW())
	`

	_, err := tx.ExecContext(ctx, query, reservaID, data)
	return err
}

func (s *SessaoStorage) GetAllConfirmed(ctx context.Context) ([]types.SessaoEvento, error) {

	query := `
		SELECT s.id, s.reserva_evento_id, s.data, s.criado_em
		FROM sessoes_evento s
		JOIN reserva_eventos r ON r.id = s.reserva_evento_id
		WHERE r.status = 'CONFIRMADA'
		ORDER BY s.data
	`

	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sessoes []types.SessaoEvento

	for rows.Next() {
		var sessa types.SessaoEvento

		err := rows.Scan(
			&sessa.ID,
			&sessa.ReservaEventoID,
			&sessa.Data,
			&sessa.CriadoEm,
		)

		if err != nil {
			return nil, err
		}

		sessoes = append(sessoes, sessa)
	}

	return sessoes, nil
}

func (s *SessaoStorage) GetByReservaID(ctx context.Context, reservaID string) ([]string, error) {

	query := `
		SELECT data
		FROM sessoes_evento
		WHERE reserva_evento_id = $1
		ORDER BY data
	`

	rows, err := s.db.QueryContext(ctx, query, reservaID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var datas []string

	for rows.Next() {
		var d string
		if err := rows.Scan(&d); err != nil {
			return nil, err
		}
		datas = append(datas, d)
	}

	return datas, nil
}