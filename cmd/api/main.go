package main

import (
	"expvar"
	"log"
	"runtime"
	"time"

	"github.com/joho/godotenv"
	"github.com/rpambo/web-site-onda-branca/internal/db"
	"github.com/rpambo/web-site-onda-branca/internal/env"
	"github.com/rpambo/web-site-onda-branca/internal/mailer"
	"github.com/rpambo/web-site-onda-branca/internal/ratelimiter"
	"github.com/rpambo/web-site-onda-branca/internal/store"
	"go.uber.org/zap"

	_ "github.com/lib/pq"
)

const version = "1.0.0"

func main() {
	_ = godotenv.Load()
	cfg := config{
		addr: env.GetString("ADDR", ":8080"),
		apiURL: env.GetString("EXTERNAL_URL", "localhost:8080"),
		frontendURL: env.GetString("FRONTEND_URL", "localhost:4200"),
		env: env.GetString("ENV", "developmente"),
		ratelimiter: ratelimiter.Config{
			RequestsPerTimeFrame: env.GetInt("RATELIMITER_REQUESTS_COUNT", 20),
			TimeFrame: time.Second * 5,
			Enabled: env.GetBoll("RATE_LIMITER_ENABLED", true),
		},
		mail: mailConfig{
			exp: time.Hour * 24 * 3, // 3 dias
			fromEmail: env.GetString("FROM_EMAIL", ""),
			mailTrap: mailTrapConfig{
				apikey: env.GetString("MAILTRAP_API_KEY", ""),
			},
		},
		db: dbConfig{
			addr: env.GetString("DB_ADDR", "postgres://rpambo:admin@localhost:5433/ondabranca?sslmode=disable"),
			maxOpenIdleCons: env.GetInt("DB_MAX_OPEN_IDLE_CONS", 25),
			maxIdleCons: env.GetInt("DB_MAX_IDLE_CONS", 25),
			maxIdleTime: env.GetString("DB_MAX_IDLE_TIME", "15m"),
		},
	}

	db, err := db.New(cfg.db.addr, cfg.db.maxOpenIdleCons, cfg.db.maxIdleCons, cfg.db.maxIdleTime)
	
	if err != nil{
		log.Panic(err)
	}

	store := store.NewStorage(db)

	//logger
	logger := zap.Must(zap.NewProduction()).Sugar()
	defer logger.Sync()

	//ratelimiter
	ratelimiter := ratelimiter.NewFixedWindowLimiter(cfg.ratelimiter.RequestsPerTimeFrame, cfg.ratelimiter.TimeFrame)
	
	//mail
	//mailtrap
	mailtrap, err := mailer.NewMailTrapClient(cfg.mail.mailTrap.apikey, cfg.mail.fromEmail)
	if err != nil{
		logger.Fatal(err)
	}

	app := &application {
		config: cfg,
		mailer: mailtrap,
		logger: logger,
		ratelimiter: ratelimiter,
		store: store,
	}

	// Metrics collected
	expvar.NewString("version").Set(version)
	expvar.Publish("goroutines", expvar.Func(func() any {
		return runtime.NumGoroutine()
	}))

	mux := app.mount()

	app.logger.Fatal(app.run(mux))
}