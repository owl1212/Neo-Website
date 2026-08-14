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
	CompanyName  string `json:"companyName"`
	ContactName  string `json:"contactName"`
	Email        string `json:"email"`
	Phone        string `json:"phone"`
	Province     string `json:"province"`
	Town         string `json:"town"`
	BusinessType string `json:"businessType"`
	Message      string `json:"message"`
}

// Create godoc
// @Summary      Submit a reseller application
// @Description  Public endpoint used by the storefront's "become a reseller" form. Persists the application and triggers a background email notification.
// @Tags         reseller-applications
// @Accept       json
// @Produce      json
// @Param        request  body      handlers.resellerApplicationRequest  true  "Reseller application"
// @Success      201      {object}  models.ResellerApplication
// @Failure      400      {object}  handlers.ErrorResponse
// @Failure      500      {object}  handlers.ErrorResponse
// @Router       /api/reseller-applications [post]
func (h *ResellerHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req resellerApplicationRequest
	if err := decodeJSON(w, r, &req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	app := &models.ResellerApplication{
		CompanyName:  req.CompanyName,
		ContactName:  req.ContactName,
		Email:        req.Email,
		Phone:        req.Phone,
		Province:     req.Province,
		Town:         req.Town,
		BusinessType: req.BusinessType,
		Message:      req.Message,
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

// List godoc
// @Summary      List reseller applications
// @Description  Admin-only endpoint to review submitted reseller applications, newest first.
// @Tags         reseller-applications
// @Produce      json
// @Security     BearerAuth
// @Success      200  {array}   models.ResellerApplication
// @Failure      401  {object}  handlers.ErrorResponse
// @Failure      500  {object}  handlers.ErrorResponse
// @Router       /api/reseller-applications [get]
func (h *ResellerHandler) List(w http.ResponseWriter, r *http.Request) {
	apps, err := h.svc.List(r.Context())
	if err != nil {
		respondError(w, http.StatusInternalServerError, "failed to list applications")
		return
	}
	writeJSON(w, http.StatusOK, apps)
}
