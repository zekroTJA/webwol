package opt

func Opt[T any](v []T, def ...T) T {
	if len(v) != 0 {
		return v[0]
	}
	var vDef T
	return Opt(def, vDef)
}
