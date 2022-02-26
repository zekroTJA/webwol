package hasher

import (
	"runtime"

	"github.com/alexedwards/argon2id"
)

type Argon2ID struct {
	params *argon2id.Params
}

var _ Hasher = (*Argon2ID)(nil)

func NewArgon2ID() *Argon2ID {
	return &Argon2ID{
		params: &argon2id.Params{
			Memory:      128 * 1024,
			Iterations:  4,
			Parallelism: uint8(runtime.NumCPU()),
			SaltLength:  16,
			KeyLength:   32,
		},
	}
}

func (h *Argon2ID) Generate(v string) (hsh string, err error) {
	return argon2id.CreateHash(v, h.params)
}

func (h *Argon2ID) Equal(v string, hsh string) (match bool, err error) {
	return argon2id.ComparePasswordAndHash(v, hsh)
}
