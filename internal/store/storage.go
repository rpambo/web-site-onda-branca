package store

import (
	"context"
	"database/sql"

	"github.com/rpambo/web-site-onda-branca/types"
)

type Storage struct { 

	db *sql.DB

	ReservaStorage interface{
		CreateTx(context.Context, *sql.Tx ,*types.ReservaEvento) error
		GetByID(context.Context, string) (*types.ReservaEvento, error)
		UpdateStatus( context.Context, string, types.StatusReserva ) error
	}

	SessaoStorage interface{
		CreateTx(context.Context, *sql.Tx, string, string) error
		GetAllConfirmed(context.Context) ([]types.SessaoEvento, error)
		GetByReservaID(context.Context, string) ([]string, error)
	}
}

func NewStorage(db *sql.DB) Storage {
	return Storage{
		db: db,

		ReservaStorage: &ReservaStorage{db},
		SessaoStorage: &SessaoStorage{db},
	}
}

func (s *Storage) BeginTx(ctx context.Context) (*sql.Tx, error) {
    return s.db.BeginTx(ctx, nil)
}