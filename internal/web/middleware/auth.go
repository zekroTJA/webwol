package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/zekrotja/webwol/pkg/auth"
)

func Auth(ath auth.Auth) fiber.Handler {
	return func(ctx *fiber.Ctx) (err error) {
		token := ctx.Get("authorization")

		if len(token) < 8 || !strings.HasPrefix(strings.ToLower(token), "bearer ") {
			return fiber.ErrUnauthorized
		}

		_, err = ath.Validate(token[7:])

		if err != nil {
			return fiber.ErrUnauthorized
		}

		return ctx.Next()
	}
}
