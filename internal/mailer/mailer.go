package mailer

import "embed"

const (
    FromName                          = "OndaBranca"
    maxRetires                        = 3
    UserWelcomeTemplate               = "user_invitation.tmpl"
    SalesTeamNotificationTemplate     = "sales_team_notification.tmpl"
    UserComplaintReceivedTemplate     = "user_complaint_received_template.tmpl"
    SupportTeamComplaintTemplate      = "support_team_complaint_template.tmpl"
    Bruchura                          = "bruchura.tmpl"
    TeamNotificationTemplate          = "team_notification_template.tmpl"

    // Programa Saúde Mental do Trabalhador
    SaudeMentalClientTemplate         = "saude_mental_client.tmpl"
    SaudeMentalSalesTemplate          = "saude_mental_sales.tmpl"

    // Mentoria P7
	MentoriaClientTemplate        = "mentoria_client.tmpl"
	MentoriaSalesTemplate         = "mentoria_sales.tmpl"

    // Projeto de Qualidade de Vida
	QualidadeVidaClientTemplate = "qualidade_vida_client.tmpl"
	QualidadeVidaSalesTemplate  = "qualidade_vida_sales.tmpl"

    // Ginástica Laboral
	GinasticaClientTemplate = "ginastica_laboral_client.tmpl"
	GinasticaSalesTemplate  = "ginastica_laboral_sales.tmpl"

    // Palestras e Workshops
    PalestraWorkshopClientTemplate = "palestra_workshop_client.tmpl"
    PalestraWorkshopSalesTemplate  = "palestra_workshop_sales.tmpl"

    ReservaClienteTemplate = "reserva_evento_client.tmpl"
	ReservaEquipeTemplate  = "reserva_evento_sales.tmpl"

    // 🆕 CANCELAMENTO
    ReservaCanceladaClienteTemplate = "reserva_evento_cancelada_client.tmpl"
)

//go:embed "templates"
var FS embed.FS

type Client interface{
	Send(templateFile, username, email string, data any, isSandbox bool) (int, error)
}