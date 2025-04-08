package routes

import (
	"backend/handlers/producto"

	"github.com/gofiber/fiber/v2"
)

// SetupRoutes sets up the routes for the applicatio
func SetupRoutes(app *fiber.App) {
	// Define the routes for the application
	app.Get("/productos", producto.GetProductosHandler)
}
