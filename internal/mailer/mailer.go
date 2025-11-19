package mailer

import "embed"

const (
	FromName            				= "OndaBranca"
	maxRetires          				= 3
	UserWelcomeTemplate 				= "user_invitation.tmpl"
	SalesTeamNotificationTemplate		= "sales_team_notification.tmpl"
	UserComplaintReceivedTemplate		= "user_complaint_received_template.tmpl"
	SupportTeamComplaintTemplate        = "support_team_complaint_template.tmpl"
	Bruchura 							= "bruchura.tmpl"
	TeamNotificationTemplate			= "team_notification_template.tmpl"
)

//go:embed "templates"
var FS embed.FS

type Client interface{
	Send(templateFile, username, email string, data any, isSandbox bool) (int, error)
}