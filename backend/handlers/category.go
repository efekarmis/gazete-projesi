package handlers

import (
	"gazete-backend/database"
	"gazete-backend/models"

	"github.com/gofiber/fiber/v2"
)

// Menü için kategorileri getir
func GetCategories(c *fiber.Ctx) error {
	var categories []models.Category

	database.DB.Find(&categories)

	return c.JSON(categories)
}
