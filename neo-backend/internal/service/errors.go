package service

import "errors"

// ErrValidation wraps input validation failures so handlers can map them
// to a 400 response instead of a generic 500.
var ErrValidation = errors.New("validation failed")

// ErrInvalidCredentials indicates a failed admin login so handlers can map
// it to a 401 response instead of a generic 500.
var ErrInvalidCredentials = errors.New("invalid credentials")
