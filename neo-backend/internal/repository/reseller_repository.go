package repository

import (
	"context"
	"database/sql"
	"fmt"

	"neo-backend/internal/models"
)

// ResellerRepository persists reseller applications.
type ResellerRepository interface {
	Create(ctx context.Context, app *models.ResellerApplication) error
	List(ctx context.Context) ([]models.ResellerApplication, error)
}

type pgResellerRepository struct {
	db *sql.DB
}

func NewResellerRepository(db *sql.DB) ResellerRepository {
	return &pgResellerRepository{db: db}
}

func (r *pgResellerRepository) Create(ctx context.Context, app *models.ResellerApplication) error {
	const q = `
		INSERT INTO reseller_applications (company_name, contact_name, email, phone, province, message)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, status, created_at
	`
	err := r.db.QueryRowContext(ctx, q,
		app.CompanyName, app.ContactName, app.Email, app.Phone, app.Province, app.Message,
	).Scan(&app.ID, &app.Status, &app.CreatedAt)
	if err != nil {
		return fmt.Errorf("reseller_repository: create: %w", err)
	}
	return nil
}

func (r *pgResellerRepository) List(ctx context.Context) ([]models.ResellerApplication, error) {
	const q = `
		SELECT id, company_name, contact_name, email, phone, province, message, status, created_at
		FROM reseller_applications
		ORDER BY created_at DESC
	`
	rows, err := r.db.QueryContext(ctx, q)
	if err != nil {
		return nil, fmt.Errorf("reseller_repository: list: %w", err)
	}
	defer rows.Close()

	apps := []models.ResellerApplication{}
	for rows.Next() {
		var a models.ResellerApplication
		var phone, province, message sql.NullString
		if err := rows.Scan(&a.ID, &a.CompanyName, &a.ContactName, &a.Email, &phone, &province, &message, &a.Status, &a.CreatedAt); err != nil {
			return nil, fmt.Errorf("reseller_repository: scan: %w", err)
		}
		a.Phone = phone.String
		a.Province = province.String
		a.Message = message.String
		apps = append(apps, a)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("reseller_repository: rows: %w", err)
	}

	return apps, nil
}
