package mailer

import "embed"

const (
	FromName            				= "OndaBranca"
	maxRetires          				= 3
	UserWelcomeTemplate 				= "user_invitation.tmpl"
	SalesTeamNotificationTemplate		= "sales_team_notification.tmpl"
)

//go:embed "templates"
var FS embed.FS

type Client interface{
	Send(templateFile, username, email string, data any, isSandbox bool) (int, error)
}