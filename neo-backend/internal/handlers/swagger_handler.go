package handlers

import (
	"net/http"

	"neo-backend/docs"
)

// SwaggerDoc serves the raw OpenAPI 2.0 spec consumed by the UI below.
func SwaggerDoc(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write(docs.SwaggerJSON)
}

// SwaggerUI serves a Swagger UI page against /swagger/doc.json. The
// swagger-ui-dist bundle is loaded from a CDN at request time (in the
// browser), not fetched during the Go build, so it needs internet access
// wherever this is deployed — the API itself has no such dependency.
func SwaggerUI(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Write([]byte(swaggerUIHTML))
}

const swaggerUIHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>NEO Backend API — Swagger UI</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: "/swagger/doc.json",
        dom_id: "#swagger-ui",
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
      });
    };
  </script>
</body>
</html>
`
