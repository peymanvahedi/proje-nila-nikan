import { Metadata } from "next"
import { getRegion } from "@lib/data/regions"
import HeroSlider from "@modules/home/components/hero-slider"
import StoriesRow from "@modules/home/components/stories-row"
import path from "path"
import fs from "fs/promises"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "پوشاک کودک | شاد، راحت و استاندارد",
  description: "صفحه اصلی فروشگاه",
}

type Slide = { src: string; alt?: string; w?: number; h?: number }
type Story = { src: string; label: string; href?: string }

async function loadSlides(): Promise<Slide[]> {
  const p = path.join(process.cwd(), "public", "uploads", "banners", "banners.json")
  try {
    const raw = await fs.readFile(p, "utf-8")
    const data = JSON.parse(raw)
    const arr: Slide[] = Array.isArray(data) ? data : data?.slides || []
    return arr.slice(0, 9)
  } catch {
    return []
  }
}

async function loadStories(): Promise<Story[]> {
  try {
    const res = await fetch("http://localhost:8000/api/stories", { cache: "no-store" })
    if (!res.ok) return []
    const { items } = await res.json()
    return Array.isArray(items) ? items.slice(0, 20) : []
  } catch {
    return []
  }
}

export default async function Home({ params }: { params: { countryCode: string } }) {
  const region = await getRegion(params.countryCode)
  if (!region) return null

  const [slides, stories] = await Promise.all([loadSlides(), loadStories()])

  return (
    <>
      <HeroSlider slides={slides} />
      <div className="content-container mt-4">
        <StoriesRow stories={stories} />
      </div>
      <main className="content-container my-6">{/* بقیه صفحه */}</main>
    </>
  )
}
