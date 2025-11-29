import { getArticle, getArticles } from '@/lib/api'; // getArticles eklendi
import { Article } from '@/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage(props: PageProps) {
  const params = await props.params;
  
  // 1. Haberi ve Diğer Haberleri Paralel Çek
  const articleData: Promise<Article | null> = getArticle(params.slug);
  const allArticlesData: Promise<Article[]> = getArticles();

  const [article, allArticles] = await Promise.all([articleData, allArticlesData]);

  // 2. Haber yoksa 404
  if (!article) {
    return notFound();
  }

  // 3. İlgili Haberleri Filtrele:
  // - Şu an okunan haberi listeden çıkar (id'si eşit olmayanları al)
  // - İlk 3 tanesini seç
  const relatedArticles = allArticles
    .filter((item) => item.ID !== article.ID)
    .slice(0, 3);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 bg-dark-bg text-light-text font-display">
      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        
        {/* --- SOL KOLON --- */}
        <div className="lg:col-span-8">
          
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 mb-6 text-sm font-medium">
            <Link href="/" className="text-light-text-secondary hover:text-primary transition-colors">Ana Sayfa</Link>
            <span className="text-light-text-secondary">/</span>
            <Link href={`/kategori/${article.category?.slug}`} className="text-light-text-secondary hover:text-primary transition-colors uppercase">
              {article.category?.name}
            </Link>
            <span className="text-light-text-secondary">/</span>
            <span className="text-white truncate max-w-[200px]">{article.title}</span>
          </div>

          {/* Kapak Fotoğrafı */}
          <div 
            className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl min-h-[320px] md:min-h-[450px] mb-8 shadow-lg border border-dark-border/50" 
            style={{ backgroundImage: `url("${article.image_url}")` }}
          ></div>

          {/* Başlık */}
          <h1 className="text-white font-serif tracking-tight text-3xl md:text-4xl lg:text-5xl font-bold leading-tight pb-3">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-light-text-secondary text-sm font-normal pb-8 pt-2 border-b border-dark-border mb-8">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{format(new Date(article.published_at), 'd MMMM yyyy, EEEE', { locale: tr })}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={18} />
              <span className="hover:text-primary transition-colors">Editör</span>
            </div>
          </div>

          {/* İçerik */}
          <div 
            className="prose prose-invert prose-lg max-w-none 
            prose-headings:font-serif prose-headings:text-white 
            prose-p:text-light-text prose-p:leading-relaxed 
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-primary prose-blockquote:bg-dark-card prose-blockquote:py-1 prose-blockquote:px-4"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* --- SAĞ SIDEBAR --- */}
        <aside className="lg:col-span-4 mt-12 lg:mt-0">
          <div className="sticky top-28 space-y-8">
            {/* Eczane */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold font-serif text-white mb-4">Nöbetçi Eczane</h3>
              <div className="space-y-3">
                <p className="text-primary font-bold text-lg">Merkez Eczanesi</p>
                <div className="flex items-start gap-3 text-light-text">
                  <MapPin size={20} className="text-light-text-secondary mt-1" />
                  <span>Atatürk Cad. No:12</span>
                </div>
                <div className="flex items-center gap-3 text-light-text">
                  <Clock size={20} className="text-light-text-secondary" />
                  <span>24 Saat Açık</span>
                </div>
              </div>
            </div>

            {/* Vefat */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold font-serif text-white mb-4">Vefat İlanları</h3>
              <ul className="space-y-4">
                <li className="border-b border-dark-border pb-3">
                  <Link href="#" className="group block">
                    <p className="font-semibold text-white group-hover:text-primary transition-colors">Ahmet Yılmaz</p>
                    <p className="text-sm text-light-text-secondary">1955 - 2025</p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* --- İLGİLİ HABERLER (ARTIK GERÇEK VERİ) --- */}
      {relatedArticles.length > 0 && (
        <div className="mt-16 pt-12 border-t border-dark-border">
          <h2 className="text-3xl font-bold font-serif text-white mb-8">Bunları da Beğenebilirsiniz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedArticles.map((news) => (
              <Link href={`/haber/${news.slug}`} key={news.ID} className="flex flex-col group cursor-pointer">
                <div 
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg overflow-hidden mb-4 opacity-80 group-hover:opacity-100 transition-opacity border border-dark-border/30" 
                  style={{ backgroundImage: `url("${news.image_url}")` }}
                ></div>
                <p className="text-primary text-sm font-bold mb-1 uppercase">
                  {news.category?.name}
                </p>
                <h3 className="text-lg font-semibold text-white group-hover:underline line-clamp-2">
                  {news.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}

    </main>
  );
}