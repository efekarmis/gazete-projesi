package database

import (
	"fmt"
	"log"
	"os"
	"time"

	"gazete-backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect() {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Europe/Istanbul",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	var db *gorm.DB
	var err error

	// 5 Kere Deneme Döngüsü (Retry Logic)
	for i := 1; i <= 5; i++ {
		log.Printf("Veritabanına bağlanılıyor... (Deneme %d/5)", i)

		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})

		if err == nil {
			log.Println("Veritabanına başarıyla bağlanıldı!")
			break // Bağlandık, döngüden çık
		}

		log.Printf("Bağlantı başarısız: %v. 2 saniye bekleniyor...", err)
		time.Sleep(2 * time.Second)
	}

	// 5 deneme sonunda hala hata varsa programı kapat
	if err != nil {
		log.Fatal("Veritabanına bağlanılamadı! Pes ediliyor. Hata: ", err)
	}

	// Auto-Migration
	log.Println("Tablolar oluşturuluyor...")
	db.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Article{},
		&models.StaticPage{},
		&models.Obituary{},
	)
	log.Println("Tablolar başarıyla oluşturuldu/güncellendi!")

	DB = db
}
