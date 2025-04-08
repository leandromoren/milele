package main

import (
	connection "backend/models/db" // o con la ruta larga si así está en go.mod
	"backend/routes"
	"log"

	"github.com/gofiber/fiber/v2"
)

func main() {
	conn, err := connection.GetConnectionDb()
	if err != nil {
		log.Fatalf("Error al conectar a la base de datos: %v", err)
	}
	defer conn.Close()
	app := fiber.New()
	routes.SetupRoutes(app)
	app.Listen(":3000")
}
