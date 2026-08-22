package types

import "time"

type InfoEmpresa struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Contact string `json:"contact"`
	Service string `json:"service"`
	Message string `json:"message"`
}

type ComplaintPayload struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

type Bruchura struct {
	Email string `json:"email"`
}

type ProgramaSaudeMentalTrabalhador struct {
	Name              string `json:"name"`
	Email             string `json:"email"`
	Contact           string `json:"contact"`
	Company           string `json:"company"`
	NumberOfEmployees int    `json:"numberOfEmployees"`
	ServiceType       string `json:"serviceType"`
	SpecificNeeds     string `json:"specificNeeds"`
	Message           string `json:"message"`
}

type P7Mentoria struct {
	Name            string `json:"name"`
	Email           string `json:"email"`
	Contact         string `json:"contact"`
	ParticipantType string `json:"participantType"`
	Company         string `json:"company,omitempty"`
	MainChallenges  string `json:"mainChallenges"`
	MentoriaGoals   string `json:"mentoriaGoals"`
	Availability    string `json:"availability"`
	Message         string `json:"message"`
}

type QualidadeVida struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Contact string `json:"contact"`

	Age *int `json:"age,omitempty"`

	AreasInterest   string `json:"areasInterest"`
	PersonalGoal    string `json:"personalGoal"`
	Frequencia      string `json:"frequencia"`
	ExperiencePrior string `json:"experiencePrior"`

	Message string `json:"message"`
}

type GinasticaLaboral struct {
	Name               string `json:"name"`
	Email              string `json:"email"`
	Telefone           string `json:"telefone"`
	Empresa            string `json:"empresa"`
	NumeroFuncionarios int    `json:"numeroFuncionarios"`
	Area               string `json:"area"`
	AtividadePreferida string `json:"atividadePreferida"`
	Objetivos          string `json:"objetivos"`
	Frequencia         string `json:"frequencia"`
	Mensagem           string `json:"mensagem,omitempty"`
}

type PalestraWorkshop struct {
	Name         string `json:"name"`
	Email        string `json:"email"`
	Contact      string `json:"contact"`
	Company      string `json:"company"`
	EventType    string `json:"eventType"`
	Topic        string `json:"topic"`
	AudienceSize int    `json:"audienceSize"`
	Location     string `json:"location"`
	EventDate    string `json:"eventDate"`
	Objective    string `json:"objective"`
	Message      string `json:"message,omitempty"`
}

type ReservaEvento struct {
	ID            string `json:"id"`
	Nome          string `json:"name"`
	Email         string `json:"email"`
	Telefone      string `json:"contact"`
	Empresa       string `json:"company"`
	TipoInteresse string `json:"interestType"`
	TipoEvento    string `json:"eventType"`
	Participantes int    `json:"participants"`

	Datas []string `json:"dates"`

	CoffeeBreak struct {
		Incluido bool   `json:"included"`
		Tipo     string `json:"type"`
		Pessoas  int    `json:"people"`
	} `json:"coffeeBreak"`

	Necessidades string `json:"specificNeeds"`
	Mensagem     string `json:"message"`

	Status StatusReserva `json:"status"`

	Token string `json:"-"`

	ConfirmURL string    `json:"-"`
	CancelURL  string    `json:"-"`
	CriadoEm   time.Time `json:"createdAt"`
}

type SessaoEvento struct {
	ID              int       `json:"id"`
	ReservaEventoID string    `json:"reservaEventId"`
	Data            string    `json:"date"`
	CriadoEm        time.Time `json:"createdAt"`
}

type StatusReserva string

const (
	StatusPendente   StatusReserva = "PENDENTE"
	StatusConfirmada StatusReserva = "CONFIRMADA"
	StatusCancelada  StatusReserva = "CANCELADA"
)