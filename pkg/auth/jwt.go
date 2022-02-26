package auth

import (
	"time"

	"github.com/robbert229/jwt"
	"github.com/zekroTJA/shinpuru/pkg/random"
	"github.com/zekrotja/webwol/pkg/opt"
)

type JwtAuthConfig struct {
	SigningKey string
	Lifetime   time.Duration
}

type JwtAuth struct {
	cfg JwtAuthConfig
	alg jwt.Algorithm
}

var _ Auth = (*JwtAuth)(nil)

func NewJwtAuth(cfg ...JwtAuthConfig) (a *JwtAuth, err error) {
	a = &JwtAuth{}
	a.cfg = opt.Opt(cfg)

	if a.cfg.Lifetime == 0 {
		a.cfg.Lifetime = 30 * time.Minute
	}
	if a.cfg.SigningKey == "" {
		a.cfg.SigningKey, err = getRandString(128)
		if err != nil {
			return
		}
	}

	a.alg = jwt.HmacSha512(a.cfg.SigningKey)

	return
}

func (a *JwtAuth) GetToken(ident string) (token string, exp time.Time, err error) {
	exp = time.Now().Add(a.cfg.Lifetime)
	claims := jwt.NewClaim()
	claims.Set("sub", ident)
	claims.SetTime("exp", exp)
	token, err = a.alg.Encode(claims)
	return
}

func (a *JwtAuth) Validate(token string) (ident string, err error) {
	claims, err := a.alg.DecodeAndValidate(token)
	if err != nil {
		return
	}
	exp, err := claims.GetTime("exp")
	if err != nil || time.Now().After(exp) {
		err = ErrExpired
		return
	}
	identV, err := claims.Get("sub")
	if err != nil {
		return
	}
	ident, ok := identV.(string)
	if !ok {
		err = ErrEmptyIdent
	}
	return
}

func getRandString(ln int) (r string, err error) {
	d, err := random.GetRandByteArray(128)
	if err != nil {
		return
	}
	r = string(d)
	return
}
