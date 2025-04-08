package producto

import (
	"github.com/gofiber/fiber/v2"
)

func GetProductosHandler(c *fiber.Ctx) error {
	productos, err := GetAllProducts()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(productos)
}
