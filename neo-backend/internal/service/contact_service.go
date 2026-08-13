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

// ContactService validates and processes contact/warranty submissions.
type ContactService interface {
	Submit(ctx context.Context, sub *models.ContactSubmission) error
}

type contactService struct {
	repo   repository.ContactRepository
	mailer *mailer.Mailer
}

func NewContactService(repo repository.ContactRepository, m *mailer.Mailer) ContactService {
	return &contactService{repo: repo, mailer: m}
}

func (s *contactService) Submit(ctx context.Context, sub *models.ContactSubmission) error {
	sub.Name = strings.TrimSpace(sub.Name)
	sub.Email = strings.TrimSpace(sub.Email)
	sub.Phone = strings.TrimSpace(sub.Phone)
	sub.Type = strings.TrimSpace(sub.Type)
	sub.Message = strings.TrimSpace(sub.Message)

	if sub.Name == "" {
		return fmt.Errorf("%w: name is required", ErrValidation)
	}
	if _, err := mail.ParseAddress(sub.Email); err != nil {
		return fmt.Errorf("%w: email is invalid", ErrValidation)
	}
	if sub.Type != "contact" && sub.Type != "warranty" {
		return fmt.Errorf(`%w: type must be "contact" or "warranty"`, ErrValidation)
	}
	if sub.Message == "" {
		return fmt.Errorf("%w: message is required", ErrValidation)
	}

	if err := s.repo.Create(ctx, sub); err != nil {
		return fmt.Errorf("contact_service: submit: %w", err)
	}

	// Sent in the background: notification failure (or a slow/unreachable
	// SMTP server) must never delay or fail the HTTP response — the
	// submission is already saved.
	go func(sub models.ContactSubmission) {
		defer func() {
			if r := recover(); r != nil {
				log.Printf("contact_service: notify panicked for submission %d: %v", sub.ID, r)
			}
		}()
		if err := s.mailer.NotifyContact(&sub); err != nil {
			log.Printf("contact_service: notify failed for submission %d: %v", sub.ID, err)
		}
	}(*sub)

	return nil
}
