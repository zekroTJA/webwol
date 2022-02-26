package database

import "errors"

var (
	ErrNotFound = errors.New("not found")
)

func IsErrDatabaseNotFound(err error) bool {
	return err == ErrNotFound
}
