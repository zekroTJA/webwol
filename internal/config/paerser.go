package config

import (
	"os"

	"github.com/joho/godotenv"
	"github.com/traefik/paerser/env"
	"github.com/traefik/paerser/file"
	"github.com/zekrotja/webwol/pkg/models"
)

const defaultConfigLoc = "./config.yaml"

type Paerser struct {
	cfg        *models.Config
	configFile string
}

func NewPaerser(configFile string) *Paerser {
	return &Paerser{
		configFile: configFile,
	}
}

func (p *Paerser) Instance() *models.Config {
	return p.cfg
}

func (p *Paerser) Load() (err error) {
	godotenv.Load()

	cfg := models.DefaultConfig

	cfgFile := defaultConfigLoc
	if p.configFile != "" {
		cfgFile = p.configFile
	}
	if err = file.Decode(cfgFile, &cfg); err != nil && !os.IsNotExist(err) {
		return
	}

	if err = env.Decode(os.Environ(), "WW_", &cfg); err != nil {
		return
	}

	p.cfg = &cfg

	return
}
