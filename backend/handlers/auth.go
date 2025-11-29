package handlers

import (
	"gazete-backend/database"
	"gazete-backend/models"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// Login Fonksiyonu
func Login(c *fiber.Ctx) error {
	// 1. Frontend'den gelen veriyi karşılayacak yapı
	type LoginInput struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var input LoginInput
	// Gelen JSON verisini parse et
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Giriş bilgileri hatalı formatta"})
	}

	// 2. Kullanıcıyı veritabanında ara
	var user models.User
	// Username'e göre ilk kaydı bul
	database.DB.Where("username = ?", input.Username).First(&user)

	// Kullanıcı yoksa ID 0 gelir
	if user.ID == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Kullanıcı bulunamadı"})
	}

	// 3. Şifreyi Kontrol Et (Hash kıyaslama)
	// Veritabanındaki şifreli hali ile girilen şifreyi kıyaslar
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Şifre yanlış!"})
	}

	// 4. JWT Token Oluştur (Kimlik Kartı Basımı)
	token := jwt.New(jwt.SigningMethodHS256)

	// Token içine bilgiler (Claims) koy
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = user.ID
	claims["username"] = user.Username
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix() // 72 saat geçerli

	// .env dosyasından gelen gizli anahtarı al
	secret := os.Getenv("JWT_SECRET")

	// Token'ı imzala
	t, err := token.SignedString([]byte(secret))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Token oluşturulamadı"})
	}

	// 5. Başarılı Sonuç Dön
	return c.JSON(fiber.Map{
		"message": "Giriş başarılı",
		"token":   t,
	})
}
