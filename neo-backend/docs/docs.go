// Package docs embeds the hand-authored OpenAPI 2.0 spec for this API.
//
// This is a stand-in for swaggo/swag's generated docs.go: the swaggo
// comment annotations already sit above the handlers and cmd/api/main.go
// in the standard swag format, but the swag CLI wasn't reachable to run
// `swag init` when this was written. Once it is, regenerate with:
//
//	go install github.com/swaggo/swag/cmd/swag@latest
//	swag init -g cmd/api/main.go -o docs
//
// which will overwrite swagger.json (and add swagger.yaml + a generated
// docs.go) from the annotations directly — keep this file's //go:embed
// directive if you replace it by hand instead of regenerating.
package docs

import _ "embed"

//go:embed swagger.json
var SwaggerJSON []byte
