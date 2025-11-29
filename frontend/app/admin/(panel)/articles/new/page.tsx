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
  const [imageUrl, setImageUrl] = useState(""); // Şimdilik manuel link, sonra upload yapacağız

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
            
            {/* Resim Yükleme (Şimdilik Input) */}
            <div className="bg-card-dark rounded-lg border border-dark-border p-6">
              <label className="block text-sm font-medium mb-2">Kapak Resmi URL</label>
              <div className="flex flex-col gap-2">
                <input 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-background-dark border border-dark-border rounded-md p-2 text-sm"
                  placeholder="https://..."
                />
                {imageUrl && (
                  <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-md border border-dark-border" />
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