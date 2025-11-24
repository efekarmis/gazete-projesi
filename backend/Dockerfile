# backend/Dockerfile
FROM golang:1.23-alpine

# Gerekli sistem araçlarını yükle
RUN apk add --no-cache git

# Çalışma dizini
WORKDIR /app

# Canlı yenileme (Live Reload) için 'Air' aracını yükle
# NOT: @latest sürümü bazen uyumsuzluk çıkarabiliyor, bu yüzden sürümü sabitledik (v1.51.0)
RUN go install github.com/cosmtrek/air@v1.51.0

# Bağımlılıkları kopyala
COPY go.mod go.sum ./
RUN go mod download

# Tüm kodları kopyala
COPY . .

# Air'i, eski adıyla çağırıyoruz (cosmtrek/air)
CMD ["air"]