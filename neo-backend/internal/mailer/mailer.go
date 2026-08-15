package mailer

import (
	"crypto/tls"
	"fmt"
	"html"
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
	body := buildHTMLEmail("New Reseller Application", []fieldRow{
		{"Company", app.CompanyName},
		{"Contact", app.ContactName},
		{"Email", app.Email},
		{"Phone", app.Phone},
		{"Province", app.Province},
		{"Town", app.Town},
		{"Business type", app.BusinessType},
	}, app.Message)
	return m.send(subject, body)
}

// NotifyContact emails NotifyEmail when a new contact/warranty submission is received.
func (m *Mailer) NotifyContact(sub *models.ContactSubmission) error {
	subject := fmt.Sprintf("New %s submission from %s", sub.Type, sub.Name)
	body := buildHTMLEmail("New Contact Submission", []fieldRow{
		{"Name", sub.Name},
		{"Email", sub.Email},
		{"Phone", sub.Phone},
		{"Type", sub.Type},
	}, sub.Message)
	return m.send(subject, body)
}

// fieldRow is one label/value line in a notification email's summary table.
type fieldRow struct {
	label string
	value string
}

// buildHTMLEmail renders a small branded HTML notification: a dark header
// with the title, a two-column table of fields, and — if non-empty — a
// message block below it. Table-based layout with inline styles because
// that's what actually renders consistently across email clients (Gmail,
// Outlook, etc. strip <style> blocks and modern CSS).
func buildHTMLEmail(title string, rows []fieldRow, message string) string {
	var rowsHTML strings.Builder
	for _, r := range rows {
		value := r.value
		if strings.TrimSpace(value) == "" {
			value = "—"
		}
		rowsHTML.WriteString(fmt.Sprintf(
			`<tr>`+
				`<td style="padding:8px 16px;color:#7a7178;font-size:13px;font-weight:600;white-space:nowrap;vertical-align:top;">%s</td>`+
				`<td style="padding:8px 16px;color:#1a1518;font-size:14px;">%s</td>`+
				`</tr>`,
			html.EscapeString(r.label), html.EscapeString(value),
		))
	}

	messageBlock := ""
	if strings.TrimSpace(message) != "" {
		messageBlock = fmt.Sprintf(
			`<tr><td colspan="2" style="padding:16px 16px 4px;color:#7a7178;font-size:13px;font-weight:600;">Message</td></tr>`+
				`<tr><td colspan="2" style="padding:0 16px 20px;color:#1a1518;font-size:14px;line-height:1.6;">%s</td></tr>`,
			escapeMultiline(message),
		)
	}

	return fmt.Sprintf(`<!doctype html>
<html>
  <body style="margin:0;padding:24px;background-color:#f4f1ee;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #ece7e2;">
      <tr>
        <td style="background-color:#0d0b0c;padding:20px 24px;">
          <span style="color:#FF6D29;font-weight:700;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">NEO Zambia</span>
          <div style="color:#ffffff;font-weight:700;font-size:18px;margin-top:4px;">%s</div>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;">
          <table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
            %s
            %s
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`, html.EscapeString(title), rowsHTML.String(), messageBlock)
}

// escapeMultiline HTML-escapes a user-supplied string and turns newlines
// into <br> — done in that order so a literal "<br>" typed by a user can't
// smuggle in real markup.
func escapeMultiline(s string) string {
	return strings.ReplaceAll(html.EscapeString(s), "\n", "<br>")
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
	sb.WriteString("From: " + sanitizeHeaderValue(from) + "\r\n")
	sb.WriteString("To: " + sanitizeHeaderValue(to) + "\r\n")
	sb.WriteString("Subject: " + sanitizeHeaderValue(subject) + "\r\n")
	sb.WriteString("MIME-Version: 1.0\r\n")
	sb.WriteString("Content-Type: text/html; charset=\"utf-8\"\r\n")
	sb.WriteString("\r\n")
	sb.WriteString(body)
	return []byte(sb.String())
}

// sanitizeHeaderValue strips CR/LF from a header value. Subject is built
// from user-controlled input (e.g. a reseller's company name); without
// this, a value containing "\r\n" could inject extra headers into the raw
// SMTP message.
func sanitizeHeaderValue(s string) string {
	s = strings.ReplaceAll(s, "\r", "")
	return strings.ReplaceAll(s, "\n", "")
}
