package handlers

import (
	"fmt"
	"path/filepath"
	"time"

	"github.com/gofiber/fiber/v2"
)

// Dosya Yükleme
func UploadFile(c *fiber.Ctx) error {
	// 1. Dosyayı istekten al ("image" anahtarıyla gelecek)
	file, err := c.FormFile("image")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Dosya yüklenemedi"})
	}

	// 2. Benzersiz dosya ismi oluştur (timestamp_dosyaadi.jpg)
	// Bu sayede aynı isimli dosyalar birbirini ezmez.
	filename := fmt.Sprintf("%d_%s", time.Now().Unix(), file.Filename)

	// 3. Kaydedilecek yol
	savePath := filepath.Join("./uploads", filename)

	// 4. Dosyayı kaydet
	if err := c.SaveFile(file, savePath); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Dosya sunucuya kaydedilemedi"})
	}

	// 5. Erişilebilir URL'i geri dön
	// Not: Gerçek sunucuda localhost yerine domain adı olacak
	fullURL := fmt.Sprintf("http://localhost:8080/uploads/%s", filename)

	return c.JSON(fiber.Map{
		"url": fullURL,
	})
}
