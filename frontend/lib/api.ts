// frontend/lib/api.ts

// Eğer kod tarayıcıda çalışıyorsa localhost, sunucuda (Docker) çalışıyorsa 'backend' kullan
const API_URL = typeof window === 'undefined' 
  ? 'http://backend:8080/api' // Docker içinden erişim (Server Side)
  : 'http://localhost:8080/api'; // Tarayıcıdan erişim (Client Side)

export async function getHeadlines() {
  const res = await fetch(`${API_URL}/headlines`, {
    cache: 'no-store', // Her girişte veriyi taze çek (Haber sitesi olduğu için)
  });
  
  if (!res.ok) {
    throw new Error('Manşetler çekilemedi');
  }
  
  return res.json();
}

export async function getArticles() {
  const res = await fetch(`${API_URL}/articles`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Haberler çekilemedi');
  }

  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) return [];
  return res.json();
}

export async function getArticle(slug: string) {
  // Backend'e slug soruyoruz
  const res = await fetch(`${API_URL}/articles/${slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return null; // Haber bulunamazsa null döner
  }

  return res.json();
}

// En alta ekle:

export async function getArticlesByCategory(slug: string) {
  const res = await fetch(`${API_URL}/articles/category/${slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}