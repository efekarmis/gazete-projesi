// frontend/types/index.ts

export interface Category {
  ID: number;
  name: string;
  slug: string;
}

export interface Article {
  ID: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image_url: string;
  is_headline: boolean;
  published_at: string;
  category_id: number;
  category: Category; // İlişkisel veri
  views: number;
}