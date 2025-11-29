"use client";

import { Article } from "@/types";
import { Eye, Edit, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  initialArticles: Article[];
}

export default function DashboardTable({ initialArticles }: Props) {
  const [articles, setArticles] = useState(initialArticles);
  const router = useRouter();

  // Manşet Durumunu Değiştir (Toggle Headline)
  const toggleHeadline = async (id: number, currentStatus: boolean) => {
    try {
      // 1. Backend'e istek at (Henüz bu endpoint'i yazmadık ama hazırlık olsun)
      // Şimdilik sadece UI'da değiştiriyoruz, backend'i sonra ekleyeceğiz.
      // await fetch(`${API_URL}/articles/${id}/headline`, { method: 'PATCH' ... })

      // 2. State'i güncelle (Anlık değişim)
      setArticles(articles.map(article => 
        article.ID === id ? { ...article, is_headline: !currentStatus } : article
      ));
    } catch (error) {
      console.error("Manşet değiştirilemedi", error);
    }
  };

  // Haberi Sil
  const handleDelete = async (id: number) => {
    if (!confirm("Bu haberi silmek istediğinize emin misiniz?")) return;

    try {
      // Backend'e silme isteği (Token lazım olacak, şimdilik basit fetch)
      // const res = await fetch(`http://localhost:8080/api/articles/${id}`, { method: 'DELETE' });
      
      // Listeden çıkar
      setArticles(articles.filter(a => a.ID !== id));
      router.refresh(); // Sayfayı yenile
    } catch (error) {
      alert("Silme işlemi başarısız");
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-dark-border bg-background-light dark:bg-card-dark">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 dark:bg-white/5">
            <tr>
              <th className="px-4 py-3 text-black dark:text-light-text-secondary text-sm font-medium w-16">Resim</th>
              <th className="px-4 py-3 text-black dark:text-light-text-secondary text-sm font-medium min-w-64">Başlık & Kategori</th>
              <th className="px-4 py-3 text-black dark:text-light-text-secondary text-sm font-medium">Durum</th>
              <th className="px-4 py-3 text-black dark:text-light-text-secondary text-sm font-medium">Okunma</th>
              <th className="px-4 py-3 text-black dark:text-light-text-secondary text-sm font-medium text-center">Manşet</th>
              <th className="px-4 py-3 text-black dark:text-light-text-secondary text-sm font-medium">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
            {articles.map((news) => (
              <tr key={news.ID} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                {/* Resim */}
                <td className="px-4 py-3 align-middle">
                  <div 
                    className="bg-center bg-no-repeat bg-cover rounded-md size-10 border border-dark-border/50" 
                    style={{ backgroundImage: `url("${news.image_url}")` }}
                  ></div>
                </td>
                
                {/* Başlık & Kategori */}
                <td className="px-4 py-3 align-middle">
                  <Link href={`/haber/${news.slug}`} target="_blank" className="font-bold text-black dark:text-white text-sm hover:underline line-clamp-1">
                    {news.title}
                  </Link>
                  <p className="text-gray-500 dark:text-light-text-secondary text-xs uppercase mt-0.5">
                    {news.category?.name}
                  </p>
                </td>

                {/* Durum (Şimdilik hepsi Yayında) */}
                <td className="px-4 py-3 align-middle">
                  <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/50 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                    Yayında
                  </span>
                </td>

                {/* Okunma Sayısı */}
                <td className="px-4 py-3 align-middle text-gray-600 dark:text-light-text-secondary text-sm">
                  <div className="flex items-center gap-1.5">
                    <Eye size={16} />
                    <span>{news.views}</span>
                  </div>
                </td>

                {/* Manşet Yıldızı */}
                <td className="px-4 py-3 align-middle text-center">
                  <button 
                    onClick={() => toggleHeadline(news.ID, news.is_headline)}
                    className={`cursor-pointer p-2 rounded-full transition-colors ${
                      news.is_headline 
                        ? "text-yellow-500 hover:bg-yellow-500/10" 
                        : "text-gray-500 dark:text-dark-border hover:text-yellow-500"
                    }`}
                  >
                    <Star size={20} fill={news.is_headline ? "currentColor" : "none"} />
                  </button>
                </td>

                {/* İşlemler */}
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/articles/edit/${news.ID}`}>
                      <button className="p-2 rounded-lg text-gray-400 dark:text-light-text-secondary hover:bg-white/10 hover:text-white transition-colors">
                        <Edit size={18} />
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(news.ID)}
                      className="p-2 rounded-lg text-gray-400 dark:text-light-text-secondary hover:bg-red-500/10 hover:text-primary transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}