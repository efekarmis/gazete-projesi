package models

import (
	"time"

	"gorm.io/gorm"
)

// User: Admin paneline giriş yapacak kişi (Annen)
type User struct {
	gorm.Model        // ID, CreatedAt, UpdatedAt, DeletedAt otomatik gelir
	Username   string `gorm:"unique;not null" json:"username"`
	Password   string `gorm:"not null" json:"-"` // json:"-" şifrenin API'de görünmesini engeller
}

// Category: Haber kategorileri (Gündem, Spor vs.)
type Category struct {
	gorm.Model
	Name     string    `gorm:"not null" json:"name"`
	Slug     string    `gorm:"unique;not null" json:"slug"` // URL için (ornek: /gundem)
	Articles []Article `json:"articles,omitempty"`          // Bir kategorinin birden çok haberi olabilir
}

// Article: Haberler
type Article struct {
	gorm.Model
	Title       string    `gorm:"not null" json:"title"`
	Slug        string    `gorm:"uniqueIndex;not null" json:"slug"` // URL için (ornek: /haber-basligi)
	Summary     string    `gorm:"type:text" json:"summary"`         // Kısa özet
	Content     string    `gorm:"type:text" json:"content"`         // HTML içerik
	ImageURL    string    `json:"image_url"`                        // Kapak fotoğrafı linki
	IsHeadline  bool      `gorm:"default:false" json:"is_headline"` // Manşet mi?
	PublishedAt time.Time `json:"published_at"`                     // Yayınlanma tarihi (Scheduling için)
	CategoryID  uint      `json:"category_id"`                      // Hangi kategoriye ait?
	Category    Category  `json:"category"`                         // İlişki (Join işlemi için)
	Views       int       `gorm:"default:0" json:"views"`           // Okunma sayısı
}

// StaticPage: Künye, Hakkımızda, Gizlilik Politikası
type StaticPage struct {
	gorm.Model
	Title   string `gorm:"not null" json:"title"`
	Slug    string `gorm:"unique;not null" json:"slug"`
	Content string `gorm:"type:text" json:"content"`
}

// Obituary: Vefat İlanları
type Obituary struct {
	gorm.Model
	FullName    string    `gorm:"not null" json:"full_name"`
	DeathDate   time.Time `json:"death_date"`
	BurialPlace string    `json:"burial_place"` // Defin yeri
}
