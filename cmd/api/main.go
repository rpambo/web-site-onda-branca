package main

import (
	"expvar"
	"runtime"
	"time"

	"github.com/joho/godotenv"
	"github.com/rpambo/web-site-onda-branca/internal/env"
	"github.com/rpambo/web-site-onda-branca/internal/mailer"
	"github.com/rpambo/web-site-onda-branca/internal/ratelimiter"
	"go.uber.org/zap"
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
	}

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
	}

	// Metrics collected
	expvar.NewString("version").Set(version)
	expvar.Publish("goroutines", expvar.Func(func() any {
		return runtime.NumGoroutine()
	}))

	mux := app.mount()

	app.logger.Fatal(app.run(mux))
}