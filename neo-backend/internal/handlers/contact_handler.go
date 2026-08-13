package handlers

import (
	"errors"
	"net/http"

	"neo-backend/internal/models"
	"neo-backend/internal/service"
)

// ContactHandler wraps service.ContactService and exposes:
//   - Create: POST /api/contact
type ContactHandler struct {
	svc service.ContactService
}

func NewContactHandler(svc service.ContactService) *ContactHandler {
	return &ContactHandler{svc: svc}
}

type contactSubmissionRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Phone   string `json:"phone"`
	Type    string `json:"type"`
	Message string `json:"message"`
}

func (h *ContactHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req contactSubmissionRequest
	if err := decodeJSON(w, r, &req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	sub := &models.ContactSubmission{
		Name:    req.Name,
		Email:   req.Email,
		Phone:   req.Phone,
		Type:    req.Type,
		Message: req.Message,
	}

	if err := h.svc.Submit(r.Context(), sub); err != nil {
		if errors.Is(err, service.ErrValidation) {
			respondError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondError(w, http.StatusInternalServerError, "failed to submit contact request")
		return
	}

	writeJSON(w, http.StatusCreated, sub)
}
