package models

import "time"

var (
	StatusOK = &Status{200, "ok"}
)

type Error struct {
	Error   string `json:"error"`
	Code    int    `json:"code"`
	Context string `json:"context,omitempty"`
}

type Status struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type LoginRequest struct {
	Password string `json:"password"`
}

type TokenResponse struct {
	Token   string    `json:"token"`
	Expires time.Time `json:"expires"`
}

type InitializedResponse struct {
	IsInitialiezd bool `json:"is_initialized"`
}

type InitializationRequest struct {
	LoginRequest

	Key string `json:"key"`
}

type PingResponse struct {
	Successful  bool    `json:"successful"`
	RTT         int64   `json:"rtt"`
	SuccessRate float32 `json:"success_rate"`
}
