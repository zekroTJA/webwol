package embedded

import "embed"

var (
	//go:embed webdist
	FrontendFiles embed.FS
)
