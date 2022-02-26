package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/rs/xid"
	"github.com/zekrotja/webwol/internal/database"
	"github.com/zekrotja/webwol/internal/util"
	"github.com/zekrotja/webwol/pkg/imcp"
	"github.com/zekrotja/webwol/pkg/models"
	"github.com/zekrotja/webwol/pkg/wol"
)

type DevicseController struct {
	db database.Database
}

func NewDeviceController(
	router fiber.Router,
	db database.Database,
) (c *DevicseController) {
	c = &DevicseController{db}

	router.Get("", c.list)
	router.Post("", c.addUpdate)
	router.Get("/:id", c.get)
	router.Post("/:id", c.addUpdate)
	router.Delete("/:id", c.delete)
	router.Post("/:id/wake", c.wake)
	router.Post("/:id/ping", c.ping)

	return
}

func (c *DevicseController) list(ctx *fiber.Ctx) (err error) {
	devs, err := c.db.ListDevices()
	if err != nil && !database.IsErrDatabaseNotFound(err) {
		return
	}
	return ctx.JSON(util.Unnilify(devs))
}

func (c *DevicseController) get(ctx *fiber.Ctx) (err error) {
	id := ctx.Params("id")

	dev, err := c.db.GetDevice(id)
	if err != nil {
		return
	}

	return ctx.JSON(dev)
}

func (c *DevicseController) addUpdate(ctx *fiber.Ctx) (err error) {
	id := ctx.Params("id")
	if id == "" {
		id = xid.New().String()
	} else if _, err = c.db.GetDevice(id); err != nil {
		return
	}

	var dev models.Device
	if err = ctx.BodyParser(&dev); err != nil {
		return
	}
	if err = dev.Validate(); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	dev.UID = id
	if err = c.db.SetDevice(&dev); err != nil {
		return
	}

	return ctx.JSON(dev)
}

func (c *DevicseController) delete(ctx *fiber.Ctx) (err error) {
	id := ctx.Params("id")

	if err = c.db.RemoveDevice(id); err != nil {
		return
	}

	return ctx.JSON(models.StatusOK)
}

func (c *DevicseController) wake(ctx *fiber.Ctx) (err error) {
	id := ctx.Params("id")

	dev, err := c.db.GetDevice(id)
	if err != nil {
		return
	}

	if err = wol.SendMagicPacket(dev.MacAddress, ""); err != nil {
		return
	}

	return ctx.JSON(models.StatusOK)
}

func (c *DevicseController) ping(ctx *fiber.Ctx) (err error) {
	id := ctx.Params("id")

	dev, err := c.db.GetDevice(id)
	if err != nil {
		return
	}

	if dev.IPAddress == "" {
		return fiber.NewError(fiber.StatusBadRequest, "device has no ip address")
	}

	var res models.PingResponse
	stats, err := imcp.Ping(dev.IPAddress)
	res.Successful = err == nil && stats.PacketLoss == 0
	res.RTT = stats.AvgRtt.Microseconds()

	return ctx.JSON(res)
}
