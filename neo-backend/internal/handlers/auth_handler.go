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

// Login godoc
// @Summary      Admin login
// @Description  Authenticates against ADMIN_USERNAME/ADMIN_PASSWORD and returns a signed JWT (see JWT_EXPIRY_HOURS for lifetime) for use with admin-only endpoints.
// @Tags         admin
// @Accept       json
// @Produce      json
// @Param        request  body      handlers.loginRequest  true  "Admin credentials"
// @Success      200      {object}  handlers.loginResponse
// @Failure      400      {object}  handlers.ErrorResponse
// @Failure      401      {object}  handlers.ErrorResponse
// @Router       /api/admin/login [post]
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
