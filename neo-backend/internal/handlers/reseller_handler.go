package handlers

import (
	"errors"
	"net/http"

	"neo-backend/internal/models"
	"neo-backend/internal/service"
)

// ResellerHandler wraps service.ResellerService and exposes:
//   - Create: POST /api/reseller-applications
//   - List:   GET  /api/reseller-applications  (admin-only, behind JWT middleware)
type ResellerHandler struct {
	svc service.ResellerService
}

func NewResellerHandler(svc service.ResellerService) *ResellerHandler {
	return &ResellerHandler{svc: svc}
}

type resellerApplicationRequest struct {
	CompanyName string `json:"companyName"`
	ContactName string `json:"contactName"`
	Email       string `json:"email"`
	Phone       string `json:"phone"`
	Province    string `json:"province"`
	Message     string `json:"message"`
}

func (h *ResellerHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req resellerApplicationRequest
	if err := decodeJSON(w, r, &req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	app := &models.ResellerApplication{
		CompanyName: req.CompanyName,
		ContactName: req.ContactName,
		Email:       req.Email,
		Phone:       req.Phone,
		Province:    req.Province,
		Message:     req.Message,
	}

	if err := h.svc.Submit(r.Context(), app); err != nil {
		if errors.Is(err, service.ErrValidation) {
			respondError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondError(w, http.StatusInternalServerError, "failed to submit application")
		return
	}

	writeJSON(w, http.StatusCreated, app)
}

func (h *ResellerHandler) List(w http.ResponseWriter, r *http.Request) {
	apps, err := h.svc.List(r.Context())
	if err != nil {
		respondError(w, http.StatusInternalServerError, "failed to list applications")
		return
	}
	writeJSON(w, http.StatusOK, apps)
}
