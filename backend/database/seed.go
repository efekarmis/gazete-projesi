package database

import (
	"gazete-backend/models"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// Seed: Veritabanına sahte veriler basar
func Seed() {
	var count int64
	DB.Model(&models.User{}).Count(&count)

	if count > 0 {
		log.Println("Veritabanı zaten dolu, seed işlemi atlanıyor. 🚀")
		return
	}

	log.Println("Veritabanı boş, örnek veriler basılıyor... 🌱")

	// 1. Admin Oluştur
	password, _ := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
	admin := models.User{
		Username: "admin",
		Password: string(password),
	}
	DB.Create(&admin)

	// 2. Kategoriler Oluştur
	gundem := models.Category{Name: "Gündem", Slug: "gundem"}
	spor := models.Category{Name: "Spor", Slug: "spor"}
	yasam := models.Category{Name: "Yaşam", Slug: "yasam"}

	DB.Create(&gundem)
	DB.Create(&spor)
	DB.Create(&yasam)

	// 3. Haberler Oluştur
	haber1 := models.Article{
		Title:       "İlçemizde Büyük Kermes Düzenlendi",
		Slug:        "ilcemizde-buyuk-kermes",
		Summary:     "Her yıl düzenlenen geleneksel kermes bu yıl da büyük ilgi gördü.",
		Content:     "<p>İlçe meydanında düzenlenen kermese binlerce vatandaş katıldı...</p>",
		ImageURL:    "https://placehold.co/600x400/png",
		IsHeadline:  true, // Manşet
		PublishedAt: time.Now(),
		CategoryID:  gundem.ID,
		Views:       150,
	}

	haber2 := models.Article{
		Title:       "Belediyespor Şampiyonluğa Koşuyor",
		Slug:        "belediyespor-sampiyonluga-kosuyor",
		Summary:     "Temsilcimiz son maçını 3-0 kazanarak liderliğini sürdürdü.",
		Content:     "<p>Pazar günü oynanan maçta taraftarlar stadyumu doldurdu...</p>",
		ImageURL:    "https://placehold.co/600x400/orange/white",
		IsHeadline:  false,
		PublishedAt: time.Now(),
		CategoryID:  spor.ID,
		Views:       45,
	}

	haber3 := models.Article{
		Title:       "Tarihi Çınar Ağacı Koruma Altına Alındı",
		Slug:        "tarihi-cinar-agaci-koruma",
		Summary:     "300 yıllık çınar ağacı için belediye harekete geçti.",
		Content:     "<p>Çevre düzenlemesi yapılan parkta...</p>",
		ImageURL:    "https://placehold.co/600x400/green/white",
		IsHeadline:  true,
		PublishedAt: time.Now().Add(-24 * time.Hour), // Dün yayınlanmış
		CategoryID:  yasam.ID,
		Views:       320,
	}

	DB.Create(&haber1)
	DB.Create(&haber2)
	DB.Create(&haber3)

	// 4. Vefat İlanı
	vefat := models.Obituary{
		FullName:    "Ahmet Yılmaz",
		DeathDate:   time.Now(),
		BurialPlace: "Merkez Mezarlığı",
	}
	DB.Create(&vefat)

	log.Println("Örnek veriler başarıyla yüklendi! ✅")
}
