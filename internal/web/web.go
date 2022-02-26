package web

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/sirupsen/logrus"
	"github.com/zekrotja/webwol/internal/config"
	"github.com/zekrotja/webwol/internal/database"
	"github.com/zekrotja/webwol/internal/web/controllers"
	"github.com/zekrotja/webwol/internal/web/middleware"
	"github.com/zekrotja/webwol/pkg/auth"
	"github.com/zekrotja/webwol/pkg/hasher"
	"github.com/zekrotja/webwol/pkg/models"
)

var (
	syntaxError = &fiber.SyntaxError{}
)

type WebServer struct {
	cfg  config.Config
	auth auth.Auth

	app *fiber.App
}

func New(
	cfg config.Config,
	db database.Database,
	auth auth.Auth,
	hasher hasher.Hasher,
) (ws *WebServer, err error) {
	ws = &WebServer{}
	ws.cfg = cfg
	ws.app = fiber.New(fiber.Config{
		ErrorHandler:          ws.errorHandler,
		DisableStartupMessage: true,
	})

	if co := ws.cfg.Instance().CorsOrigins; co != "" {
		ws.app.Use(cors.New(cors.Config{
			AllowOrigins:     co,
			AllowMethods:     "GET,POST,DELETE,PUT",
			AllowHeaders:     "*",
			AllowCredentials: true,
		}))
	}

	api := ws.app.Group("/api")

	controllers.NewAuthController(api.Group("/auth"), auth, hasher, db)
	controllers.NewDeviceController(api.Group("/devices", middleware.Auth(auth)), db)

	return
}

func (ws *WebServer) ListenAndServe() error {
	addr := ws.cfg.Instance().BindAddress
	logrus.WithField("addr", addr).Info("webserver listening ...")
	return ws.app.Listen(addr)
}

func (ws *WebServer) errorHandler(ctx *fiber.Ctx, err error) error {
	if errors.As(err, &syntaxError) {
		return ws.errorHandler(ctx,
			fiber.NewError(fiber.StatusBadRequest, err.Error()))
	} else if database.IsErrDatabaseNotFound(err) {
		return ws.errorHandler(ctx, fiber.ErrNotFound)
	} else if fErr, ok := err.(*fiber.Error); ok {
		if fErr == fiber.ErrUnprocessableEntity {
			fErr = fiber.ErrBadRequest
		}

		ctx.Status(fErr.Code)
		return ctx.JSON(&models.Error{
			Error: fErr.Message,
			Code:  fErr.Code,
		})
	}

	return ws.errorHandler(ctx,
		fiber.NewError(fiber.StatusInternalServerError, err.Error()))
}
