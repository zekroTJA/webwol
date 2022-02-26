package auth

import "time"

type Auth interface {
	GetToken(ident string) (token string, exp time.Time, err error)
	Validate(token string) (ident string, err error)
}
