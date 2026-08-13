package handlers

import (
	"errors"
	"net/http"
	"time"

	"neo-backend/internal/service"
)

// AuthHandler wraps service.AuthService and exposes:
//   - Login: POST /api/admin/login
type AuthHandler struct {
	svc service.AuthService
}

func NewAuthHandler(svc service.AuthService) *AuthHandler {
	return &AuthHandler{svc: svc}
}

type loginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type loginResponse struct {
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expiresAt"`
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := decodeJSON(w, r, &req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	token, expiresAt, err := h.svc.Login(req.Username, req.Password)
	if err != nil {
		if errors.Is(err, service.ErrInvalidCredentials) {
			respondError(w, http.StatusUnauthorized, "invalid username or password")
			return
		}
		respondError(w, http.StatusInternalServerError, "failed to log in")
		return
	}

	writeJSON(w, http.StatusOK, loginResponse{Token: token, ExpiresAt: expiresAt})
}
