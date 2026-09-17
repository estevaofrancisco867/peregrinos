import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type News = {
  id: string;
  title: string;
  summary: string;
  body: string;
  image_url: string;
  published_at: string;
  sort_order: number;
};

export type Experience = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  sort_order: number;
};

export type GalleryItem = {
  id: string;
  title: string;
  image_url: string;
  sort_order: number;
};

export type Testimonial = {
  id: string;
  author: string;
  role: string;
  message: string;
  sort_order: number;
};

export type Verse = {
  id: string;
  reference: string;
  text: string;
  sort_order: number;
};

export type Leader = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  sort_order: number;
};

export type ShirtOrder = {
  id: string;
  full_name: string;
  size: string;
  quantity: number;
  whatsapp: string;
  status: string;
  created_at: string;
};

export type SiteContent = Record<string, string>;

async function listTable<T>(table: string): Promise<T[]> {
  const { data, error } = await supabase
    .from(table as never)
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as T[];
}

export const newsQuery = queryOptions({
  queryKey: ["news"],
  queryFn: () => listTable<News>("news"),
});

export const experiencesQuery = queryOptions({
  queryKey: ["experiences"],
  queryFn: () => listTable<Experience>("experiences"),
});

export const galleryQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: () => listTable<GalleryItem>("gallery"),
});

export const testimonialsQuery = queryOptions({
  queryKey: ["testimonials"],
  queryFn: () => listTable<Testimonial>("testimonials"),
});

export const versesQuery = queryOptions({
  queryKey: ["verses"],
  queryFn: () => listTable<Verse>("verses"),
});

export const leadersQuery = queryOptions({
  queryKey: ["leaders"],
  queryFn: () => listTable<Leader>("leaders"),
});

export const siteContentQuery = queryOptions({
  queryKey: ["site_content"],
  queryFn: async (): Promise<SiteContent> => {
    const { data, error } = await supabase.from("site_content").select("key, value");
    if (error) throw error;
    const map: SiteContent = {};
    for (const row of data ?? []) map[row.key] = row.value;
    return map;
  },
});

export const ordersQuery = queryOptions({
  queryKey: ["shirt_orders"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("shirt_orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as ShirtOrder[];
  },
});

export function formatDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}
