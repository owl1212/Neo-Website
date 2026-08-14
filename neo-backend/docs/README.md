# docs/

`swagger.json` is the OpenAPI 2.0 spec served at `/swagger/doc.json` and
rendered by the Swagger UI at `/swagger/index.html`.

It's hand-written today, not generated. All the handlers and `cmd/api/main.go`
already carry standard [swaggo/swag](https://github.com/swaggo/swag) comment
annotations (`@Summary`, `@Param`, `@Success`, `@Router`, etc.) — the `swag`
CLI just wasn't reachable when this was set up (no network in that sandbox).
Once you have it:

```sh
go install github.com/swaggo/swag/cmd/swag@latest
go get github.com/swaggo/http-swagger

swag init -g cmd/api/main.go -o docs
```

That regenerates `swagger.json`/`swagger.yaml` and a `docs.go` from the
annotations directly — safe to overwrite this hand-written version. If you
switch to the generated `docs.go`, also swap `internal/handlers/swagger_handler.go`
and the `/swagger/*` routes in `main.go` for `httpSwagger.WrapHandler`
(github.com/swaggo/http-swagger), which serves the same UI fully embedded
(no CDN) instead of loading swagger-ui-dist from jsdelivr in the browser.

Until then: keep `swagger.json` and the `@`-annotations in sync by hand
whenever a request/response shape or route changes.
