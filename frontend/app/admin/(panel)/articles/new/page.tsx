"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Save, ImageUp, Calendar } from "lucide-react";
import Editor from "@/components/admin/Editor";
import { getCategories } from "@/lib/api";
import { Category } from "@/types";

export default function NewArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Form Verileri
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isHeadline, setIsHeadline] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Kategorileri Çek
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // Başlık değişince Slug üret
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(val.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
  };

  // 1. ASIL YÜKLEME İŞİNİ YAPAN FONKSİYON (Ortak Kullanım)
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Yükleme başarısız");

      const data = await res.json();
      setImageUrl(data.url);
    } catch (error) {
      alert("Resim yüklenirken hata oluştu!");
    }
  };

  // 2. INPUT'TAN SEÇİLİNCE ÇALIŞAN
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  // 3. SÜRÜKLEME OLAYLARI (DRAG & DROP)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Tarayıcının dosyayı açmasını engelle
    setIsDragging(true); // Görsel efekti aç
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false); // Görsel efekti kapat
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0]; // Sürüklenen dosyayı al
    if (file) uploadFile(file);
  };

  // Kaydetme Fonksiyonu
  const handleSave = async () => {
    if (!title || !content || !categoryId) {
      alert("Lütfen Başlık, Kategori ve İçerik alanlarını doldurun.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // İlerde buraya Token ekleyeceğiz: "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          slug,
          summary,
          content,
          category_id: Number(categoryId), // Sayıya çevir
          is_headline: isHeadline,
          image_url: imageUrl,
          published_at: new Date().toISOString().split('T')[0] // Bugünün tarihi (YYYY-MM-DD)
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Kaydetme başarısız");
      }

      alert("Haber başarıyla yayınlandı! 🎉");
      router.push("/admin/dashboard"); // Dashboard'a geri dön

    } catch (error: any) {
      alert("Hata: " + error.message);
    }
  };

    // Resim Yükleme Fonksiyonu
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Yükleme başarısız");

      const data = await res.json();
      setImageUrl(data.url); // Gelen URL'i state'e yaz (Otomatik doldur)
    } catch (error) {
      alert("Resim yüklenirken hata oluştu!");
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-dark text-light-text font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-dark-border bg-background-dark/80 px-8 py-4 backdrop-blur-sm">
        <h1 className="text-2xl font-bold font-serif text-white">Yeni Haber Ekle</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="flex items-center gap-2 rounded-md h-9 px-4 text-sm font-semibold hover:bg-white/10 transition-colors">
            <X size={16} /> Cancel
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 rounded-md h-9 px-4 bg-primary text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
            <Save size={16} /> Publish
          </button>
        </div>
      </header>

      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* SOL KOLON (İçerik) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Başlık */}
            <div className="bg-card-dark rounded-lg border border-dark-border">
              <input 
                value={title}
                onChange={handleTitleChange}
                className="w-full bg-transparent border-0 text-3xl font-bold font-serif placeholder:text-light-text-secondary/50 focus:ring-0 p-6 outline-none" 
                placeholder="Haber başlığını buraya girin..." 
              />
              <div className="border-t border-dark-border px-6 py-2">
                <p className="text-sm text-light-text-secondary">
                  domain.com/haber/<span className="text-white">{slug}</span>
                </p>
              </div>
            </div>

            {/* Özet */}
            <div className="bg-card-dark rounded-lg border border-dark-border p-6">
              <label className="block text-sm font-medium mb-2">Özet (Spot)</label>
              <textarea 
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full bg-background-dark border border-dark-border rounded-md p-3 text-light-text placeholder:text-light-text-secondary focus:ring-1 focus:ring-primary outline-none transition" 
                rows={3}
                placeholder="Haberin kısa özetini girin..."
              ></textarea>
            </div>

            {/* Editör */}
            <Editor content={content} onChange={setContent} />
          </div>

          {/* SAĞ KOLON (Ayarlar) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Resim Yükleme (Drag & Drop Aktif) */}
            <div className="bg-card-dark rounded-lg border border-dark-border p-6">
              <label className="block text-sm font-medium mb-2">Kapak Resmi</label>
              
              <div className="flex flex-col gap-4">
                <label 
                  // Olayları buraya bağlıyoruz
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-md cursor-pointer transition-all duration-200
                    ${isDragging 
                      ? "border-primary bg-primary/10 scale-[1.02]" // Sürüklerken bu stil
                      : "border-dark-border hover:border-primary/50 bg-background-dark/50" // Normal stil
                    }`}
                >
                  <div className="text-center pointer-events-none"> {/* pointer-events-none önemli */}
                    <ImageUp size={40} className={`mx-auto mb-2 transition-colors ${isDragging ? "text-primary" : "text-light-text-secondary"}`} />
                    <p className="text-sm text-light-text-secondary">
                      <span className="font-semibold text-primary">Dosya Seç</span> veya sürükle bırak
                    </p>
                    <p className="text-xs text-light-text-secondary/70 mt-1">PNG, JPG, GIF (Max 5MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleInputChange} // Değişti
                    accept="image/*" 
                  />
                </label>

                {/* Önizleme */}
                {imageUrl && (
                  <div className="relative group">
                    <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover rounded-md border border-dark-border" />
                    <button 
                      onClick={() => setImageUrl("")}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      title="Resmi Kaldır"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Kategori */}
            <div className="bg-card-dark rounded-lg border border-dark-border p-6">
              <label className="block text-sm font-medium mb-2">Kategori</label>
              <select 
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-background-dark border border-dark-border rounded-md p-2 text-light-text focus:ring-primary outline-none"
              >
                <option value="">Seçiniz...</option>
                {categories.map((cat) => (
                  <option key={cat.ID} value={cat.ID}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Manşet Ayarı */}
            <div className="bg-card-dark rounded-lg border border-dark-border p-6">
              <div className="flex items-center justify-between">
                <label className="text-sm">Manşete Ekle</label>
                <button 
                  onClick={() => setIsHeadline(!isHeadline)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isHeadline ? 'bg-primary' : 'bg-gray-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isHeadline ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}