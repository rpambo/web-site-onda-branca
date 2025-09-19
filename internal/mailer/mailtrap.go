package mailer


import (
	"bytes"
	"errors"

	"text/template"

	gomail "gopkg.in/mail.v2"
)

type mailtrapClient struct {
	fromEmail string
	apiKey    string
}

func NewMailTrapClient(apiKey, fromEmail string) (mailtrapClient, error) {
	if apiKey == "" {
		return mailtrapClient{}, errors.New("api key is required")
	}
	
	return mailtrapClient{
		fromEmail: fromEmail,
		apiKey:    apiKey,
	}, nil
}

func (m mailtrapClient) Send(templateFile, username, email string, data any, isSandbox bool) (int, error) {
    // Template parsing and building
    tmpl, err := template.ParseFS(FS, "templates/"+templateFile)
    if err != nil {
        return -1, err
    }

    subject := new(bytes.Buffer)
    if err := tmpl.ExecuteTemplate(subject, "subject", data); err != nil {
        return -1, err
    }

    body := new(bytes.Buffer)
    if err := tmpl.ExecuteTemplate(body, "body", data); err != nil {
        return -1, err
    }

    // Se estiver em sandbox, envia para e-mail de teste
    if isSandbox {
        email = "teste@seudominio.com" // <- MailTrap ou outro e-mail de teste
        subjectStr := "[SANDBOX] " + subject.String()
        subject.Reset()
        subject.WriteString(subjectStr)
    }

    message := gomail.NewMessage()
    message.SetHeader("From", m.fromEmail)
    message.SetHeader("To", email)
    message.SetHeader("Subject", subject.String())
    message.AddAlternative("text/html", body.String())

    // Dialer - Gmail apenas em produção
    dialer := gomail.NewDialer("smtp.gmail.com", 587, m.fromEmail, m.apiKey)

    if err := dialer.DialAndSend(message); err != nil {
        return -1, err
    }

    return 200, nil
}