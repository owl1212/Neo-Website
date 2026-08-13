package service

import (
	"context"
	"fmt"
	"log"
	"net/mail"
	"strings"

	"neo-backend/internal/mailer"
	"neo-backend/internal/models"
	"neo-backend/internal/repository"
)

// ResellerService validates and processes reseller application submissions.
type ResellerService interface {
	Submit(ctx context.Context, app *models.ResellerApplication) error
	List(ctx context.Context) ([]models.ResellerApplication, error)
}

type resellerService struct {
	repo   repository.ResellerRepository
	mailer *mailer.Mailer
}

func NewResellerService(repo repository.ResellerRepository, m *mailer.Mailer) ResellerService {
	return &resellerService{repo: repo, mailer: m}
}

func (s *resellerService) Submit(ctx context.Context, app *models.ResellerApplication) error {
	app.CompanyName = strings.TrimSpace(app.CompanyName)
	app.ContactName = strings.TrimSpace(app.ContactName)
	app.Email = strings.TrimSpace(app.Email)
	app.Phone = strings.TrimSpace(app.Phone)
	app.Province = strings.TrimSpace(app.Province)
	app.Message = strings.TrimSpace(app.Message)

	if app.CompanyName == "" {
		return fmt.Errorf("%w: companyName is required", ErrValidation)
	}
	if app.ContactName == "" {
		return fmt.Errorf("%w: contactName is required", ErrValidation)
	}
	if _, err := mail.ParseAddress(app.Email); err != nil {
		return fmt.Errorf("%w: email is invalid", ErrValidation)
	}

	if err := s.repo.Create(ctx, app); err != nil {
		return fmt.Errorf("reseller_service: submit: %w", err)
	}

	// Sent in the background: notification failure (or a slow/unreachable
	// SMTP server) must never delay or fail the HTTP response — the
	// submission is already saved.
	go func(app models.ResellerApplication) {
		defer func() {
			if r := recover(); r != nil {
				log.Printf("reseller_service: notify panicked for application %d: %v", app.ID, r)
			}
		}()
		if err := s.mailer.NotifyReseller(&app); err != nil {
			log.Printf("reseller_service: notify failed for application %d: %v", app.ID, err)
		}
	}(*app)

	return nil
}

func (s *resellerService) List(ctx context.Context) ([]models.ResellerApplication, error) {
	apps, err := s.repo.List(ctx)
	if err != nil {
		return nil, fmt.Errorf("reseller_service: list: %w", err)
	}
	return apps, nil
}
