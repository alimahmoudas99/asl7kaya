export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
};

export type Video = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  youtube_id: string;
  thumbnail_url: string | null;
  location: string | null;
  people_involved: string[] | null;
  category_id: string | null;
  is_external_only: boolean;
  views: number;
  published_at: string;
  updated_at: string;
  created_at: string;
  // joined
  categories?: Category;
};

export type ContactMessage = {
  id: string;
  name: string | null;
  email: string | null;
  message: string | null;
  created_at: string;
};
