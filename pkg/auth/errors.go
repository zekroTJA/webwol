package auth

import "errors"

var (
	ErrExpired    = errors.New("expired")
	ErrEmptyIdent = errors.New("empty ident")
)
