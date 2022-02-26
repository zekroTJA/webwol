package main

import (
	"flag"
	"os"

	"github.com/sirupsen/logrus"
	"github.com/zekroTJA/shinpuru/pkg/random"
	"github.com/zekrotja/webwol/internal/config"
	"github.com/zekrotja/webwol/internal/database"
	"github.com/zekrotja/webwol/internal/database/nuts"
	"github.com/zekrotja/webwol/internal/singleton"
	"github.com/zekrotja/webwol/internal/web"
	"github.com/zekrotja/webwol/pkg/auth"
	"github.com/zekrotja/webwol/pkg/hasher"
)

func main() {
	var (
		cfgFile string
		noColor bool
	)

	f := flag.NewFlagSet("webwol", flag.ExitOnError)
	f.StringVar(&cfgFile, "c", "config.yml", "The config file location")
	f.BoolVar(&noColor, "nc", false, "force disable colors log output")
	f.Parse(os.Args[1:])

	logrus.SetFormatter(&logrus.TextFormatter{
		ForceColors:     !noColor,
		FullTimestamp:   true,
		TimestampFormat: "2006/01/02 15:04:05 MST",
	})

	cfg := config.NewPaerser(cfgFile)
	if err := cfg.Load(); err != nil {
		logrus.WithError(err).Fatal("loading config failed")
	}

	db, err := nuts.New("data/db")
	if err != nil {
		logrus.WithError(err).Fatal("initializing database failed")
	}
	defer db.Close()

	checkInitialization(db)

	auth, err := auth.NewJwtAuth(auth.JwtAuthConfig{
		SigningKey: cfg.Instance().JWTSigningKey,
	})
	if err != nil {
		logrus.WithError(err).Fatal("initializing auth failed")
	}

	hsh := hasher.NewArgon2ID()

	ws, err := web.New(cfg, db, auth, hsh)
	if err != nil {
		logrus.WithError(err).Fatal("initializing webserver failed")
	}

	if err = ws.ListenAndServe(); err != nil {
		logrus.WithError(err).Fatal("starting webserver failed")
	}
}

func checkInitialization(db database.Database) {
	pwHash, err := db.GetRootPWHash()
	if err != nil && !database.IsErrDatabaseNotFound(err) {
		logrus.WithError(err).Fatal("initialization check failed")
	}

	if len(pwHash) != 0 {
		return
	}

	singleton.InitVerificationKey, err = random.GetRandBase64Str(32)
	if err != nil && !database.IsErrDatabaseNotFound(err) {
		logrus.WithError(err).Fatal("key generation failed")
	}

	logrus.
		WithField("key", singleton.InitVerificationKey).
		Warn("instance needs to be initialized")
}
