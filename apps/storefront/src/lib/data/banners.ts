export type Banner = {
  id: string
  title?: string
  subtitle?: string
  link?: string
  image_url: string
  sort_order?: number
  created_at?: string
}

export async function fetchBanners(): Promise<Banner[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9000"
  const res = await fetch(`${base}/store/banners`, { cache: "no-store" })
  if (!res.ok) return []
  const data = await res.json()
  return data?.banners ?? (Array.isArray(data) ? data : [])
}
