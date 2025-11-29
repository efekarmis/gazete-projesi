package handlers

import (
	"fmt"
	"gazete-backend/database"
	"gazete-backend/models"
	"time"

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

// Yeni Haber Ekle
func CreateArticle(c *fiber.Ctx) error {
	// 1. Gelen veriyi karşılayacak geçici yapı (DTO)
	type CreateArticleInput struct {
		Title       string `json:"title"`
		Slug        string `json:"slug"`
		Summary     string `json:"summary"`
		Content     string `json:"content"`
		ImageURL    string `json:"image_url"`
		CategoryID  uint   `json:"category_id"` // Frontend'den ID string gelebilir, Fiber çevirir
		IsHeadline  bool   `json:"is_headline"`
		PublishedAt string `json:"published_at"` // Tarih string gelir, biz çeviririz
	}

	var input CreateArticleInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Veri formatı hatalı"})
	}

	// 2. Basit Validasyon
	if input.Title == "" || input.Content == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Başlık ve İçerik zorunludur"})
	}

	// 3. Slug Kontrolü (Aynı URL var mı?)
	var existingArticle models.Article
	database.DB.Where("slug = ?", input.Slug).First(&existingArticle)
	if existingArticle.ID != 0 {
		return c.Status(400).JSON(fiber.Map{"error": "Bu başlıkta bir haber zaten var, lütfen başlığı değiştirin."})
	}

	// 4. Veritabanı Modelini Oluştur
	// Tarihi parse et (Frontend'den gelen string'i Go zamanına çevir)
	// Eğer tarih boşsa "Şimdi" olsun
	pubDate := time.Now()
	if input.PublishedAt != "" {
		parsedTime, err := time.Parse("2006-01-02", input.PublishedAt) // YYYY-MM-DD formatı
		if err == nil {
			pubDate = parsedTime
		}
	}

	article := models.Article{
		Title:       input.Title,
		Slug:        input.Slug,
		Summary:     input.Summary,
		Content:     input.Content,
		ImageURL:    input.ImageURL,
		CategoryID:  input.CategoryID,
		IsHeadline:  input.IsHeadline,
		PublishedAt: pubDate,
		Views:       0,
	}

	// 5. Kaydet
	if err := database.DB.Create(&article).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Haber kaydedilemedi: " + err.Error()})
	}

	return c.Status(201).JSON(article)
}

// ID'ye göre tek haberi getir (Admin Edit sayfası için)
// ID'ye göre tek haberi getir (Debug Modu)
func GetArticleByID(c *fiber.Ctx) error {
	id := c.Params("id")

	// 1. Terminale yazdır: Hangi ID isteniyor?
	fmt.Println("------------------------------------------------")
	fmt.Println("🔍 İSTENEN ID:", id)

	var article models.Article

	// 2. Sorguyu yap ve hatayı detaylı yakala
	result := database.DB.First(&article, id)

	if result.Error != nil {
		// 3. Hata varsa terminale yazdır
		fmt.Println("❌ HATA OLUŞTU:", result.Error)
		fmt.Println("------------------------------------------------")
		return c.Status(404).JSON(fiber.Map{
			"error":   "Haber bulunamadı",
			"details": result.Error.Error(), // Hatayı frontend'e de gönderelim
		})
	}

	fmt.Println("✅ HABER BULUNDU:", article.Title)
	fmt.Println("------------------------------------------------")

	return c.JSON(article)
}

// Haberi Güncelle
func UpdateArticle(c *fiber.Ctx) error {
	id := c.Params("id")
	var article models.Article

	// 1. Önce haberi bul
	if err := database.DB.First(&article, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Haber bulunamadı"})
	}

	// 2. Gelen veriyi al
	type UpdateInput struct {
		Title      string `json:"title"`
		Slug       string `json:"slug"`
		Summary    string `json:"summary"`
		Content    string `json:"content"`
		ImageURL   string `json:"image_url"`
		CategoryID uint   `json:"category_id"`
		IsHeadline bool   `json:"is_headline"`
	}

	var input UpdateInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Veri formatı hatalı"})
	}

	// 3. Verileri güncelle
	article.Title = input.Title
	article.Slug = input.Slug
	article.Summary = input.Summary
	article.Content = input.Content
	article.ImageURL = input.ImageURL
	article.CategoryID = input.CategoryID
	article.IsHeadline = input.IsHeadline

	// Not: PublishedAt'i güncellemiyoruz, ilk yayın tarihi kalsın.

	// 4. Kaydet
	database.DB.Save(&article)

	return c.JSON(article)
}

// Haberi Sil (Soft Delete)
func DeleteArticle(c *fiber.Ctx) error {
	id := c.Params("id")
	var article models.Article

	// 1. Haberi bul
	if err := database.DB.First(&article, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Haber bulunamadı"})
	}

	// 2. Sil (GORM DeletedAt sütununu doldurur, veriyi tamamen silmez)
	database.DB.Delete(&article)

	return c.JSON(fiber.Map{"message": "Haber başarıyla silindi"})
}
