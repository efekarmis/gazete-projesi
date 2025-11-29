package main

import (
	"gazete-backend/database"
	"gazete-backend/routes" // <-- Burayı ekle

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	database.Connect()
	database.Seed() // Veri varsa basmaz, yoksa basar

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Static("/uploads", "./uploads")
	// Rotaları Kur (SetupRoutes fonksiyonunu çağır)
	routes.SetupRoutes(app) // <-- YENİ KISIM

	app.Listen(":8080")
}
