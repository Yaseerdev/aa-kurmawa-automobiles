import { supabase } from "@/lib/supabase";

export type JournalPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  published: boolean;
  featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function getPublishedJournalPosts(
  limit?: number
): Promise<JournalPost[]> {
  let query = supabase
    .from("journal_posts")
    .select(`
      id,
      title,
      slug,
      category,
      excerpt,
      content,
      cover_image,
      published,
      featured,
      published_at,
      created_at,
      updated_at
    `)
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false }) 
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to load journal posts:", error);
    return [];
  }

  return (data ?? []) as JournalPost[];
}

export async function getPublishedJournalPostBySlug(
  slug: string
): Promise<JournalPost | null> {
  const { data, error } = await supabase
    .from("journal_posts")
    .select(`
      id,
      title,
      slug,
      category,
      excerpt,
      content,
      cover_image,
      published,
      featured,
      published_at,
      created_at,
      updated_at
    `)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to load journal post:", error);
    return null;
  }

  return data as JournalPost | null;
}