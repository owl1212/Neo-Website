package models

import "time"

// ResellerApplication mirrors the reseller_applications table.
type ResellerApplication struct {
	ID          int       `json:"id"`
	CompanyName string    `json:"companyName"`
	ContactName string    `json:"contactName"`
	Email       string    `json:"email"`
	Phone       string    `json:"phone,omitempty"`
	Province    string    `json:"province,omitempty"`
	Message     string    `json:"message,omitempty"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"createdAt"`
}
