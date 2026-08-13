package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os/signal"
	"syscall"
	"time"

	"github.com/joho/godotenv"

	"neo-backend/internal/config"
	"neo-backend/internal/db"
	"neo-backend/internal/handlers"
	"neo-backend/internal/mailer"
	"neo-backend/internal/middleware"
	"neo-backend/internal/repository"
	"neo-backend/internal/service"
)

func main() {
	// Local dev convenience; in production env vars are set directly and
	// this is a no-op if .env doesn't exist.
	_ = godotenv.Load()

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	pool, err := db.New(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("db: %v", err)
	}
	defer pool.Close()

	if err := db.RunMigrations(pool, "migrations"); err != nil {
		log.Fatalf("migrations: %v", err)
	}

	m := mailer.New(cfg)

	resellerRepo := repository.NewResellerRepository(pool)
	contactRepo := repository.NewContactRepository(pool)

	resellerSvc := service.NewResellerService(resellerRepo, m)
	contactSvc := service.NewContactService(contactRepo, m)

	authSvc := service.NewAuthService(cfg)

	resellerHandler := handlers.NewResellerHandler(resellerSvc)
	contactHandler := handlers.NewContactHandler(contactSvc)
	authHandler := handlers.NewAuthHandler(authSvc)

	mux := http.NewServeMux()
	mux.HandleFunc("POST /api/reseller-applications", resellerHandler.Create)
	mux.HandleFunc("GET /api/reseller-applications", middleware.AdminAuth(cfg.JWTSecret)(resellerHandler.List))
	mux.HandleFunc("POST /api/contact", contactHandler.Create)
	mux.HandleFunc("POST /api/admin/login", authHandler.Login)

	var handler http.Handler = mux
	handler = middleware.CORS(cfg.FrontendOrigin)(handler)
	handler = middleware.Recover(handler)

	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      handler,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	go func() {
		log.Printf("neo-backend listening on :%s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("server: %v", err)
		}
	}()

	<-ctx.Done()
	log.Println("shutting down...")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Printf("server shutdown: %v", err)
	}
}
