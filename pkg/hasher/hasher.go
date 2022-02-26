package hasher

type Hasher interface {
	Generate(v string) (hsh string, err error)
	Equal(v string, hsh string) (match bool, err error)
}
