package repository

import (
	"context"
	"database/sql"
	"fmt"

	"neo-backend/internal/models"
)

// ContactRepository persists contact/warranty submissions.
type ContactRepository interface {
	Create(ctx context.Context, sub *models.ContactSubmission) error
}

type pgContactRepository struct {
	db *sql.DB
}

func NewContactRepository(db *sql.DB) ContactRepository {
	return &pgContactRepository{db: db}
}

func (r *pgContactRepository) Create(ctx context.Context, sub *models.ContactSubmission) error {
	const q = `
		INSERT INTO contact_submissions (name, email, phone, type, message)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, status, created_at
	`
	err := r.db.QueryRowContext(ctx, q,
		sub.Name, sub.Email, sub.Phone, sub.Type, sub.Message,
	).Scan(&sub.ID, &sub.Status, &sub.CreatedAt)
	if err != nil {
		return fmt.Errorf("contact_repository: create: %w", err)
	}
	return nil
}
