package database

import "github.com/zekrotja/webwol/pkg/models"

type Database interface {
	SetRootPWHash(hsh []byte) (err error)
	GetRootPWHash() (hsh []byte, err error)

	ListDevices() (ds []*models.Device, err error)
	GetDevice(id string) (d *models.Device, err error)
	SetDevice(d *models.Device) (err error)
	RemoveDevice(id string) (err error)

	Close() (err error)
}
