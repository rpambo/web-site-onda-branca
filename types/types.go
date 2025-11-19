package types

type InfoEmpresa struct{
	Name		string		`json:"name"`
	Email		string		`json:"email"`
	Contact		string		`json:"contact"`
	Service		string		`json:"service"`
	Message		string		`json:"message"`
}

type ComplaintPayload struct {
	Name		string		`json:"name"`
	Email		string		`json:"email"`
	Message		string		`json:"message"`
}

type Bruchura struct {
	Email		string		`json:"email"`
}