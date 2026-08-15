package service

import (
	"crypto/sha256"
	"crypto/subtle"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"neo-backend/internal/config"
)

// AuthService validates admin credentials and issues JWTs for the
// admin-only endpoints.
type AuthService interface {
	Login(username, password string) (token string, expiresAt time.Time, err error)
}

type authService struct {
	adminUsername string
	adminPassword string
	jwtSecret     string
	jwtExpiry     time.Duration
}

func NewAuthService(cfg *config.Config) AuthService {
	return &authService{
		adminUsername: cfg.AdminUsername,
		adminPassword: cfg.AdminPassword,
		jwtSecret:     cfg.JWTSecret,
		jwtExpiry:     cfg.JWTExpiry,
	}
}

func (s *authService) Login(username, password string) (string, time.Time, error) {
	if !constantTimeEqual(username, s.adminUsername) || !constantTimeEqual(password, s.adminPassword) {
		return "", time.Time{}, ErrInvalidCredentials
	}

	now := time.Now()
	expiresAt := now.Add(s.jwtExpiry)

	claims := jwt.MapClaims{
		"sub":  username,
		"role": "admin",
		"iat":  now.Unix(),
		"exp":  expiresAt.Unix(),
	}
	signed, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(s.jwtSecret))
	if err != nil {
		return "", time.Time{}, fmt.Errorf("auth_service: sign token: %w", err)
	}

	return signed, expiresAt, nil
}

// constantTimeEqual compares two strings without leaking their length or
// content through timing, hashing first so ConstantTimeCompare always
// receives equal-length input.
func constantTimeEqual(a, b string) bool {
	ah := sha256.Sum256([]byte(a))
	bh := sha256.Sum256([]byte(b))
	return subtle.ConstantTimeCompare(ah[:], bh[:]) == 1
}
