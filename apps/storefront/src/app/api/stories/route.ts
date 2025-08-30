import { NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"

async function readJsonItems(jsonPath: string) {
  try {
    const raw = await fs.readFile(jsonPath, "utf-8")
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : data.items || []
  } catch {
    return []
  }
}

async function buildItemsFromImages(dirPath: string) {
  try {
    const files = await fs.readdir(dirPath)
    const imgs = files.filter(f => /\.(png|jpe?g|webp|gif|avif)$/i.test(f))
    return imgs.map((f, i) => ({
      src: `/uploads/stories/${f}`,
      label: `Story ${i + 1}`,
      href: "#",
    }))
  } catch {
    return []
  }
}

export async function GET() {
  const dirPath = path.join(process.cwd(), "public", "uploads", "stories")
  const jsonPath = path.join(dirPath, "stories.json")

  // 1) تلاش: خواندن JSON
  let items = await readJsonItems(jsonPath)

  // 2) اگر خالی بود: از تصاویر پوشه لیست بساز
  if (!items.length) {
    items = await buildItemsFromImages(dirPath)
  }

  return NextResponse.json({ items }, { status: 200 })
}
