package config

import "github.com/zekrotja/webwol/pkg/models"

type Config interface {
	Load() (err error)
	Instance() (cfg *models.Config)
}
