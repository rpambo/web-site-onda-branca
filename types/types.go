package types

type InfoEmpresa struct{
	Name		string		`json:"name"`
	Email		string		`json:"email"`
	Servico		string		`json:"servico"`
	Mensagem	string		`json:"mensagem"`
}