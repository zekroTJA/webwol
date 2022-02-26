package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/zekrotja/webwol/internal/database"
	"github.com/zekrotja/webwol/internal/singleton"
	"github.com/zekrotja/webwol/pkg/auth"
	"github.com/zekrotja/webwol/pkg/hasher"
	"github.com/zekrotja/webwol/pkg/models"
)

type AuthController struct {
	auth   auth.Auth
	hasher hasher.Hasher
	db     database.Database
}

func NewAuthController(
	router fiber.Router,
	ath auth.Auth,
	hasher hasher.Hasher,
	db database.Database,
) (c *AuthController) {
	c = &AuthController{ath, hasher, db}

	router.Get("/isinitialized", c.isInitialized)
	router.Post("/initialize", c.initialize)
	router.Post("/login", c.login)

	return
}

func (c AuthController) isInitialized(ctx *fiber.Ctx) (err error) {
	var res models.InitializedResponse
	res.IsInitialiezd = singleton.InitVerificationKey == ""

	return ctx.JSON(res)
}

func (c *AuthController) initialize(ctx *fiber.Ctx) (err error) {
	if singleton.InitVerificationKey == "" {
		return fiber.NewError(fiber.StatusBadRequest, "already initialized")
	}

	var req models.InitializationRequest
	if err = ctx.BodyParser(&req); err != nil {
		return
	}

	if req.Password == "" {
		return fiber.NewError(fiber.StatusBadRequest, "empty password")
	}

	if req.Key != singleton.InitVerificationKey {
		return fiber.ErrForbidden
	}

	pwHsh, err := c.hasher.Generate(req.Password)
	if err != nil {
		return
	}

	if err = c.db.SetRootPWHash([]byte(pwHsh)); err != nil {
		return
	}

	singleton.InitVerificationKey = ""

	return ctx.JSON(models.StatusOK)
}

func (c *AuthController) login(ctx *fiber.Ctx) (err error) {
	var pw models.LoginRequest
	if err = ctx.BodyParser(&pw); err != nil {
		return
	}

	if pw.Password == "" {
		return fiber.ErrBadRequest
	}

	pwHash, err := c.db.GetRootPWHash()
	if err != nil && !database.IsErrDatabaseNotFound(err) {
		return
	}

	if len(pwHash) == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "not initialized")
	}

	ok, err := c.hasher.Equal(pw.Password, string(pwHash))
	if err != nil {
		return
	}

	if !ok {
		return fiber.ErrUnauthorized
	}

	var token models.TokenResponse
	token.Token, token.Expires, err = c.auth.GetToken("root")
	if err != nil {
		return
	}

	return ctx.JSON(token)
}
