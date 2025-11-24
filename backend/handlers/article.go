package handlers

import (
	"gazete-backend/database"
	"gazete-backend/models"

	"github.com/gofiber/fiber/v2"
)

// Tüm haberleri getir (Ana sayfa listesi için)
func GetAllArticles(c *fiber.Ctx) error {
	var articles []models.Article

	// Veritabanından çek:
	// 1. Preload("Category"): Haberin kategorisini de içine ekle (Join işlemi)
	// 2. Order: En yeniden eskiye sırala
	// 3. Limit: Çok şişmesin diye son 20 haberi çekelim (İlerde pagination yaparız)
	result := database.DB.Preload("Category").Order("published_at desc").Limit(20).Find(&articles)

	if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Haberler çekilemedi"})
	}

	return c.JSON(articles)
}

// Sadece Manşetleri Getir (Slider için)
func GetHeadlines(c *fiber.Ctx) error {
	var headlines []models.Article

	// Sadece IsHeadline = true olanları çek
	database.DB.Preload("Category").Where("is_headline = ?", true).Order("published_at desc").Limit(5).Find(&headlines)

	return c.JSON(headlines)
}

// Tek bir haberin detayını getir (Slug ile: /haber/buyuk-yangin)
func GetArticleBySlug(c *fiber.Ctx) error {
	slug := c.Params("slug") // URL'den slug'ı al
	var article models.Article

	// Slug'a göre ara
	result := database.DB.Preload("Category").Where("slug = ?", slug).First(&article)

	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Haber bulunamadı"})
	}

	// Haberin okunma sayısını 1 artır (Background işlem)
	// Go routine ile yapıyoruz ki kullanıcıyı bekletmesin
	go func() {
		database.DB.Model(&article).UpdateColumn("views", article.Views+1)
	}()

	return c.JSON(article)
}

// Kategori Slug'ına göre haberleri getir (Örn: /api/articles/category/spor)
func GetArticlesByCategory(c *fiber.Ctx) error {
	slug := c.Params("slug")
	var category models.Category
	var articles []models.Article

	// 1. Önce kategoriyi bul (ID'sini almak için)
	result := database.DB.Where("slug = ?", slug).First(&category)
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Kategori bulunamadı"})
	}

	// 2. O kategori ID'sine sahip haberleri çek
	database.DB.Preload("Category").Where("category_id = ?", category.ID).Order("published_at desc").Find(&articles)

	return c.JSON(articles)
}
