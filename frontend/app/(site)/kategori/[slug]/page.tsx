import { getArticlesByCategory } from '@/lib/api';
import { Article } from '@/types';
import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage(props: PageProps) {
  const params = await props.params;
  const articles: Article[] = await getArticlesByCategory(params.slug);
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1); // "spor" -> "Spor"

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 min-h-screen bg-dark-bg text-light-text font-display">
      
      {/* Başlık Alanı */}
      <div className="border-b-2 border-primary mb-8 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-white uppercase tracking-wide">
          {categoryName} Haberleri
        </h1>
        <p className="text-light-text-secondary mt-2 text-sm">
          Bu kategoride toplam {articles.length} haber listeleniyor.
        </p>
      </div>

      {/* Haber Listesi (Grid) */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((news) => (
            <div key={news.ID} className="flex flex-col bg-dark-card rounded-lg border border-dark-border overflow-hidden hover:border-primary/50 transition-colors shadow-sm group">
              
              {/* Resim */}
              <Link href={`/haber/${news.slug}`} className="relative h-48 overflow-hidden">
                <div 
                  className="w-full h-full bg-center bg-no-repeat bg-cover transform group-hover:scale-105 transition-transform duration-500" 
                  style={{ backgroundImage: `url("${news.image_url}")` }}
                ></div>
              </Link>

              {/* İçerik */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs mb-3">
                   <span className="font-bold text-primary uppercase">
                    {categoryName}
                   </span>
                   <span className="text-light-text-secondary">•</span>
                   <span className="text-light-text-secondary">
                     {format(new Date(news.published_at), 'd MMM yyyy', { locale: tr })}
                   </span>
                </div>

                <Link href={`/haber/${news.slug}`}>
                  <h3 className="text-xl font-bold text-white leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                </Link>

                <p className="text-light-text text-sm line-clamp-3 mb-4">
                  {news.summary}
                </p>

                <Link href={`/haber/${news.slug}`} className="mt-auto text-sm font-bold text-light-text-secondary group-hover:text-white flex items-center gap-1 transition-colors">
                  Haberi Oku →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Haber Yoksa Gösterilecek Alan */
        <div className="text-center py-20 bg-dark-card rounded-xl border border-dashed border-dark-border">
          <p className="text-xl text-light-text-secondary">Bu kategoride henüz haber bulunmuyor.</p>
        </div>
      )}
    </main>
  );
}