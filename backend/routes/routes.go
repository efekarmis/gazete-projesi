package routes

import (
	"gazete-backend/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	// Tüm API rotaları "/api" ile başlayacak
	api := app.Group("/api")

	// Haber Rotaları
	api.Get("/articles", handlers.GetAllArticles)         // Tüm haberler
	api.Get("/headlines", handlers.GetHeadlines)          // Manşetler
	api.Get("/articles/:slug", handlers.GetArticleBySlug) // Haber detayı

	// Kategori Rotaları
	api.Get("/categories", handlers.GetCategories) // Menü kategorileri
}
