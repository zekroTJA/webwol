package util

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func QueryInt(ctx *fiber.Ctx, key string, def int) (i int, err error) {
	v := ctx.Query(key)
	if v == "" {
		i = def
		return
	}
	i, err = strconv.Atoi(v)
	return
}
