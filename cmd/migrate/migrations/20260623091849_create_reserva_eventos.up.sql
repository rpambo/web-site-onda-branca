CREATE TABLE reserva_eventos (
    id UUID PRIMARY KEY,

    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    empresa TEXT,

    tipo_interesse TEXT,
    tipo_evento TEXT,

    participantes INT NOT NULL,

    coffee_break_incluido BOOLEAN DEFAULT FALSE,
    coffee_break_tipo TEXT,
    coffee_break_pessoas INT,

    necessidades TEXT,
    mensagem TEXT,

    token UUID NOT NULL UNIQUE,

    status TEXT NOT NULL DEFAULT 'PENDENTE'
        CHECK (status IN ('PENDENTE', 'CONFIRMADA', 'CANCELADA')),

    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE sessoes_evento (
    id SERIAL PRIMARY KEY,

    reserva_evento_id UUID NOT NULL
        REFERENCES reserva_eventos(id)
        ON DELETE CASCADE,

    data DATE NOT NULL,

    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);