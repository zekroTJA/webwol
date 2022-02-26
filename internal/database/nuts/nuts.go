package nuts

import (
	"strings"

	"github.com/xujiajun/nutsdb"
	"github.com/zekrotja/webwol/internal/database"
	"github.com/zekrotja/webwol/pkg/models"
)

const (
	bucketGeneral = "general"
	bucketDevices = "devices"
)

type NutsDB struct {
	db *nutsdb.DB
}

var _ database.Database = (*NutsDB)(nil)

func New(dir string) (n *NutsDB, err error) {
	n = &NutsDB{}

	opts := nutsdb.DefaultOptions
	opts.Dir = dir
	n.db, err = nutsdb.Open(opts)

	return
}

func (n *NutsDB) Close() error {
	return n.db.Close()
}

func (n *NutsDB) SetRootPWHash(hsh []byte) (err error) {
	err = n.db.Update(func(tx *nutsdb.Tx) error {
		return tx.Put(bucketGeneral, []byte("root-pw"), hsh, 0)
	})
	return
}

func (n *NutsDB) GetRootPWHash() (hsh []byte, err error) {
	err = n.db.View(func(tx *nutsdb.Tx) error {
		r, err := tx.Get(bucketGeneral, []byte("root-pw"))
		if err != nil {
			return n.wrapErr(err)
		}
		hsh = r.Value
		return nil
	})
	return
}

func (n *NutsDB) ListDevices() (ds []*models.Device, err error) {
	var el nutsdb.Entries
	err = n.db.View(func(tx *nutsdb.Tx) error {
		el, err = tx.GetAll(bucketDevices)
		return n.wrapErr(err)
	})
	if err != nil {
		return
	}

	ds = make([]*models.Device, len(el))
	for i, e := range el {
		var d models.Device
		if d, err = models.UnmarshalDevice(e.Value); err != nil {
			return
		}
		ds[i] = &d
	}

	return
}

func (n *NutsDB) GetDevice(id string) (dp *models.Device, err error) {
	err = n.db.View(func(tx *nutsdb.Tx) error {
		entry, err := tx.Get(bucketDevices, []byte(id))
		if err != nil {
			return n.wrapErr(err)
		}
		d, err := models.UnmarshalDevice(entry.Value)
		if err != nil {
			return err
		}
		dp = &d
		return nil
	})
	return
}

func (n *NutsDB) SetDevice(d *models.Device) (err error) {
	rd, err := d.Marshal()
	if err != nil {
		return
	}
	err = n.db.Update(func(tx *nutsdb.Tx) error {
		return tx.Put(bucketDevices, []byte(d.UID), rd, 0)
	})
	return
}

func (n *NutsDB) RemoveDevice(id string) (err error) {
	err = n.db.Update(func(tx *nutsdb.Tx) error {
		return tx.Delete(bucketDevices, []byte(id))
	})
	return
}

func (n *NutsDB) wrapErr(err error) error {
	if err == nil {
		return nil
	}
	if err == nutsdb.ErrBucket ||
		strings.HasPrefix(err.Error(), "not found bucket:") ||
		err == nutsdb.ErrBucketEmpty {
		return database.ErrNotFound
	}
	return err
}
