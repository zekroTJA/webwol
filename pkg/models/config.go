package models

var DefaultConfig = Config{
	DbLocation:  "data/db",
	BindAddress: "0.0.0.0:80",
}

type Config struct {
	DbLocation    string `json:"dblocation"`
	BindAddress   string `json:"bindaddress"`
	CorsOrigins   string `json:"corsorigins"`
	JWTSigningKey string `json:"jwtsigningkey"`
}
