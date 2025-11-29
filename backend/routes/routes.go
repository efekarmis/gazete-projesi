package routes

import (
	"gazete-backend/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	// Tüm API rotaları "/api" ile başlayacak
	api := app.Group("/api")

	// Auth (Giriş)
	api.Post("/login", handlers.Login)
	api.Post("/articles", handlers.CreateArticle)
	api.Post("/upload", handlers.UploadFile)

	// Haber Rotaları
	api.Get("/articles", handlers.GetAllArticles)         // Tüm haberler
	api.Get("/headlines", handlers.GetHeadlines)          // Manşetler
	api.Get("/articles/:slug", handlers.GetArticleBySlug) // Haber detayı

	// Kategori Rotaları
	api.Get("/categories", handlers.GetCategories) // Menü kategorileri

	// Mevcut satırların altına ekle:
	api.Get("/articles/category/:slug", handlers.GetArticlesByCategory)

	// Admin İşlemleri
	api.Get("/articles/id/:id", handlers.GetArticleByID) // Düzenleme sayfasına veri çekmek için
	api.Put("/articles/:id", handlers.UpdateArticle)     // Güncelleme
	api.Delete("/articles/:id", handlers.DeleteArticle)  // Silme

}
