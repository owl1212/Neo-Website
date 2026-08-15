package mailer

import (
	"crypto/tls"
	"fmt"
	"net"
	"net/smtp"
	"strings"
	"time"

	"neo-backend/internal/config"
	"neo-backend/internal/models"
)

// sendTimeout bounds the entire SMTP exchange (dial + handshake + auth +
// message). Without it, an unreachable or black-holed SMTP host relies on
// OS-level TCP timeouts, which can run well past what's reasonable for a
// background notification.
const sendTimeout = 15 * time.Second

// Mailer sends notification emails over Gmail SMTP.
type Mailer struct {
	host        string
	port        string
	user        string
	pass        string
	notifyEmail string
}

// New builds a Mailer from config.Config's SMTP fields.
func New(cfg *config.Config) *Mailer {
	return &Mailer{
		host:        cfg.SMTPHost,
		port:        cfg.SMTPPort,
		user:        cfg.SMTPUser,
		pass:        cfg.SMTPPass,
		notifyEmail: cfg.NotifyEmail,
	}
}

// NotifyReseller emails NotifyEmail when a new reseller application is submitted.
func (m *Mailer) NotifyReseller(app *models.ResellerApplication) error {
	subject := fmt.Sprintf("New reseller application: %s", app.CompanyName)
	body := fmt.Sprintf(
		"A new reseller application was submitted.\n\n"+
			"Company: %s\nContact: %s\nEmail: %s\nPhone: %s\nProvince: %s\n\nMessage:\n%s\n",
		app.CompanyName, app.ContactName, app.Email, app.Phone, app.Province, app.Message,
	)
	return m.send(subject, body)
}

// NotifyContact emails NotifyEmail when a new contact/warranty submission is received.
func (m *Mailer) NotifyContact(sub *models.ContactSubmission) error {
	subject := fmt.Sprintf("New %s submission from %s", sub.Type, sub.Name)
	body := fmt.Sprintf(
		"A new %s submission was received.\n\n"+
			"Name: %s\nEmail: %s\nPhone: %s\n\nMessage:\n%s\n",
		sub.Type, sub.Name, sub.Email, sub.Phone, sub.Message,
	)
	return m.send(subject, body)
}

func (m *Mailer) send(subject, body string) error {
	addr := m.host + ":" + m.port

	conn, err := net.DialTimeout("tcp", addr, sendTimeout)
	if err != nil {
		return fmt.Errorf("mailer: dial: %w", err)
	}
	// Bounds every subsequent read/write on this connection — including
	// through the TLS wrapper set up by StartTLS below — to one deadline
	// for the whole exchange.
	if err := conn.SetDeadline(time.Now().Add(sendTimeout)); err != nil {
		conn.Close()
		return fmt.Errorf("mailer: set deadline: %w", err)
	}

	client, err := smtp.NewClient(conn, m.host)
	if err != nil {
		conn.Close()
		return fmt.Errorf("mailer: new client: %w", err)
	}
	defer client.Close()

	if ok, _ := client.Extension("STARTTLS"); ok {
		if err := client.StartTLS(&tls.Config{ServerName: m.host}); err != nil {
			return fmt.Errorf("mailer: starttls: %w", err)
		}
	}

	auth := smtp.PlainAuth("", m.user, m.pass, m.host)
	if err := client.Auth(auth); err != nil {
		return fmt.Errorf("mailer: auth: %w", err)
	}

	if err := client.Mail(m.user); err != nil {
		return fmt.Errorf("mailer: mail from: %w", err)
	}
	if err := client.Rcpt(m.notifyEmail); err != nil {
		return fmt.Errorf("mailer: rcpt to: %w", err)
	}

	w, err := client.Data()
	if err != nil {
		return fmt.Errorf("mailer: data: %w", err)
	}
	if _, err := w.Write(buildMessage(m.user, m.notifyEmail, subject, body)); err != nil {
		w.Close()
		return fmt.Errorf("mailer: write: %w", err)
	}
	if err := w.Close(); err != nil {
		return fmt.Errorf("mailer: close data: %w", err)
	}

	if err := client.Quit(); err != nil {
		return fmt.Errorf("mailer: quit: %w", err)
	}
	return nil
}

func buildMessage(from, to, subject, body string) []byte {
	var sb strings.Builder
	sb.WriteString("From: " + from + "\r\n")
	sb.WriteString("To: " + to + "\r\n")
	sb.WriteString("Subject: " + subject + "\r\n")
	sb.WriteString("MIME-Version: 1.0\r\n")
	sb.WriteString("Content-Type: text/plain; charset=\"utf-8\"\r\n")
	sb.WriteString("\r\n")
	sb.WriteString(body)
	return []byte(sb.String())
}
