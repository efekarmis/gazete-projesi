"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Save, ImageUp, Loader2 } from "lucide-react";
import Editor from "@/components/admin/Editor";
import { getCategories } from "@/lib/api";
import { Category } from "@/types";

// İçerik Bileşeni (Suspense içinde çalışacak)
function ArticleFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams.get("id"); // URL'den ?id=... parametresini al
  const isEditMode = !!articleId; // ID varsa Edit modudur

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode); // Veri çekiliyor mu?

  // Form Verileri
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isHeadline, setIsHeadline] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  // 1. Başlangıç Verilerini Çek
  useEffect(() => {
    const init = async () => {
      try {
        // Kategorileri her türlü çek
        const cats = await getCategories();
        setCategories(cats);

        // Eğer Edit modundaysak, haberi de çek
        if (isEditMode) {
          const res = await fetch(`http://localhost:8080/api/articles/id/${articleId}`);
          if (!res.ok) throw new Error("Haber bulunamadı");
          const article = await res.json();

          // Formu doldur
          setTitle(article.title);
          setSlug(article.slug);
          setSummary(article.summary);
          setContent(article.content);
          setCategoryId(article.category_id);
          setIsHeadline(article.is_headline);
          setImageUrl(article.image_url);
        }
      } catch (error) {
        alert("Veriler yüklenirken hata oluştu.");
        router.push("/admin/dashboard");
      } finally {
        setIsFetching(false);
      }
    };

    init();
  }, [articleId, isEditMode, router]);

  // Başlık değişince Slug üret (Sadece Create modunda otomatik olsun, Edit'te bozulmasın)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditMode) {
      setSlug(val.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
    }
  };

  // Resim Yükleme
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("http://localhost:8080/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setImageUrl(data.url);
    } catch (error) {
      alert("Resim yüklenemedi!");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  // KAYDETME / GÜNCELLEME (Unified Logic)
  const handleSubmit = async () => {
    if (!title || !content || !categoryId) {
      alert("Lütfen zorunlu alanları doldurun.");
      return;
    }

    setIsLoading(true);

    try {
      // Mod'a göre URL ve Method belirle
      const url = isEditMode 
        ? `http://localhost:8080/api/articles/${articleId}` // DİKKAT: PUT işlemi için eski rota (/articles/:id) çalışır çünkü PUT için slug rotası yok.
        : "http://localhost:8080/api/articles";
      
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          summary,
          content,
          category_id: Number(categoryId),
          is_headline: isHeadline,
          image_url: imageUrl,
          // Create modunda tarih ekle, Edit modunda backend zaten dokunmuyor
          ...(isEditMode ? {} : { published_at: new Date().toISOString().split('T')[0] })
        }),
      });

      if (!res.ok) throw new Error("İşlem başarısız");

      alert(isEditMode ? "Haber güncellendi! ✅" : "Haber oluşturuldu! 🎉");
      router.push("/admin/dashboard");

    } catch (error) {
      alert("Hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="p-10 text-white flex items-center gap-2"><Loader2 className="animate-spin"/> Yükleniyor...</div>;

  return (
    <div className="flex flex-col h-full bg-background-dark text-light-text font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-dark-border bg-background-dark/80 px-8 py-4 backdrop-blur-sm">
        <h1 className="text-2xl font-bold font-serif text-white">
          {isEditMode ? "Haberi Düzenle" : "Yeni Haber Ekle"}
        </h1>
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="flex items-center gap-2 rounded-md h-9 px-4 text-sm font-semibold hover:bg-white/10 transition-colors">
            <X size={16} /> İptal
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="flex items-center gap-2 rounded-md h-9 px-4 bg-primary text-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {isEditMode ? "Güncelle" : "Yayınla"}
          </button>
        </div>
      </header>

      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* SOL KOLON */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-card-dark rounded-lg border border-dark-border">
              <input 
                value={title}
                onChange={handleTitleChange}
                className="w-full bg-transparent border-0 text-3xl font-bold font-serif placeholder:text-light-text-secondary/50 focus:ring-0 p-6 outline-none" 
                placeholder="Haber başlığını girin..."
              />
              <div className="border-t border-dark-border px-6 py-2">
                <p className="text-sm text-light-text-secondary">
                  domain.com/haber/<span className="text-white">{slug}</span>
                </p>
              </div>
            </div>

            <div className="bg-card-dark rounded-lg border border-dark-border p-6">
              <label className="block text-sm font-medium mb-2">Özet</label>
              <textarea 
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full bg-background-dark border border-dark-border rounded-md p-3 text-light-text focus:ring-1 focus:ring-primary outline-none transition" 
                rows={3}
              ></textarea>
            </div>

            <Editor content={content} onChange={setContent} />
          </div>

          {/* SAĞ KOLON */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-card-dark rounded-lg border border-dark-border p-6">
              <label className="block text-sm font-medium mb-2">Kapak Resmi</label>
              <div className="flex flex-col gap-4">
                <label className="flex justify-center items-center w-full px-6 py-10 border-2 border-dashed border-dark-border rounded-md cursor-pointer hover:border-primary/50 transition bg-background-dark/50">
                  <div className="text-center">
                    <ImageUp size={40} className="mx-auto text-light-text-secondary mb-2" />
                    <p className="text-sm text-light-text-secondary">Değiştir / Yükle</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleInputChange} accept="image/*" />
                </label>
                {imageUrl && (
                  <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover rounded-md border border-dark-border" />
                )}
              </div>
            </div>

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

// Ana Sayfa Bileşeni (Suspense Wrapper)
// Next.js'de useSearchParams kullanan bileşenler Suspense içine alınmalıdır.
export default function ArticleFormPage() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Yükleniyor...</div>}>
      <ArticleFormContent />
    </Suspense>
  );
}