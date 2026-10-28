package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
)

// Config holds all runtime configuration, sourced from environment
// variables (see .env.example). Load() does not read .env itself —
// call godotenv.Load() (or equivalent) before Load() in local dev.
type Config struct {
	Port string

	DatabaseURL string

	SMTPHost string
	SMTPPort string
	SMTPUser string
	SMTPPass string

	// Internal addresses that receive new-submission notifications. Each
	// falls back to NOTIFY_EMAIL when its own variable is unset.
	ResellerNotifyEmail string // reseller applications + "reseller" contact enquiries
	SupportNotifyEmail  string // all other contact/warranty submissions

	JWTSecret     string
	JWTExpiry     time.Duration
	AdminUsername string
	AdminPassword string

	// FrontendOrigin is the allowed CORS origin for the Next.js frontend.
	// Defaults to "*" if unset (fine for local dev, tighten in production).
	FrontendOrigin string
}

// Load reads configuration from environment variables and validates that
// required fields are present.
func Load() (*Config, error) {
	notifyEmail := os.Getenv("NOTIFY_EMAIL")
	cfg := &Config{
		Port:                getenv("PORT", "8080"),
		DatabaseURL:         os.Getenv("DATABASE_URL"),
		SMTPHost:            os.Getenv("SMTP_HOST"),
		SMTPPort:            os.Getenv("SMTP_PORT"),
		SMTPUser:            os.Getenv("SMTP_USER"),
		SMTPPass:            os.Getenv("SMTP_PASS"),
		ResellerNotifyEmail: getenv("RESELLER_NOTIFY_EMAIL", notifyEmail),
		SupportNotifyEmail:  getenv("SUPPORT_NOTIFY_EMAIL", notifyEmail),
		JWTSecret:           os.Getenv("JWT_SECRET"),
		AdminUsername:       os.Getenv("ADMIN_USERNAME"),
		AdminPassword:       os.Getenv("ADMIN_PASSWORD"),
		FrontendOrigin:      getenv("FRONTEND_ORIGIN", "*"),
	}

	required := map[string]string{
		"DATABASE_URL": cfg.DatabaseURL,
		"SMTP_HOST":    cfg.SMTPHost,
		"SMTP_PORT":    cfg.SMTPPort,
		"SMTP_USER":    cfg.SMTPUser,
		"SMTP_PASS":    cfg.SMTPPass,
		"RESELLER_NOTIFY_EMAIL (or NOTIFY_EMAIL)": cfg.ResellerNotifyEmail,
		"SUPPORT_NOTIFY_EMAIL (or NOTIFY_EMAIL)":  cfg.SupportNotifyEmail,
		"JWT_SECRET":                              cfg.JWTSecret,
		"ADMIN_USERNAME":                          cfg.AdminUsername,
		"ADMIN_PASSWORD":                          cfg.AdminPassword,
	}
	var missing []string
	for name, val := range required {
		if strings.TrimSpace(val) == "" {
			missing = append(missing, name)
		}
	}
	if len(missing) > 0 {
		return nil, fmt.Errorf("config: missing required env vars: %s", strings.Join(missing, ", "))
	}

	expiryHoursStr := getenv("JWT_EXPIRY_HOURS", "24")
	expiryHours, err := strconv.Atoi(expiryHoursStr)
	if err != nil || expiryHours <= 0 {
		return nil, fmt.Errorf("config: JWT_EXPIRY_HOURS must be a positive integer, got %q", expiryHoursStr)
	}
	cfg.JWTExpiry = time.Duration(expiryHours) * time.Hour

	return cfg, nil
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
