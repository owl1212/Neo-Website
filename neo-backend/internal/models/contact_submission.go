package models

import "time"

// ContactSubmission mirrors the contact_submissions table.
// Type is one of "warranty", "reseller", "product", "other".
type ContactSubmission struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Phone     string    `json:"phone,omitempty"`
	Type      string    `json:"type"`
	Message   string    `json:"message"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"createdAt"`
}
