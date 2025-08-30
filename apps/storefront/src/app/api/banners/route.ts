import { NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import fssync from "fs"

export const runtime = "nodejs"

type Banner = {
  id: string
  title: string
  subtitle?: string
  link?: string
  image_url: string
  sort_order: number
  created_at: string
}

const UPLOAD_DIR = path.resolve(process.cwd(), "public", "uploads", "banners")
const DB_FILE = path.join(UPLOAD_DIR, "banners.json")

async function ensureDirs() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true })
  if (!fssync.existsSync(DB_FILE)) {
    await fs.writeFile(DB_FILE, "[]", "utf-8")
  }
}

async function readDB(): Promise<Banner[]> {
  await ensureDirs()
  try {
    const raw = await fs.readFile(DB_FILE, "utf-8")
    const list: Banner[] = JSON.parse(raw || "[]")
    return list.sort((a, b) => a.sort_order - b.sort_order)
  } catch {
    return []
  }
}

async function writeDB(list: Banner[]) {
  await ensureDirs()
  await fs.writeFile(DB_FILE, JSON.stringify(list, null, 2), "utf-8")
}

export async function GET() {
  const list = await readDB()
  return NextResponse.json({ banners: list })
}

export async function POST(req: Request) {
  await ensureDirs()
  const form = await req.formData()
  const file = form.get("image")
  const title = String(form.get("title") || "")
  const subtitle = String(form.get("subtitle") || "")
  const link = String(form.get("link") || "")

  if (!file || typeof file === "string" || !title.trim()) {
    return NextResponse.json({ error: "image و title اجباری‌اند" }, { status: 400 })
  }

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const origName = (file as File).name || "banner.jpg"
  const ext = (origName.split(".").pop() || "jpg").toLowerCase()
  const filename = `${id}.${ext}`

  const ab = await (file as File).arrayBuffer()
  await fs.writeFile(path.join(UPLOAD_DIR, filename), new Uint8Array(ab))

  const list = await readDB()
  const sort_order = (list.at(-1)?.sort_order ?? -1) + 1

  const banner: Banner = {
    id,
    title: title.trim(),
    subtitle: subtitle.trim() || undefined,
    link: link.trim(),
    image_url: `/uploads/banners/${filename}`,
    sort_order,
    created_at: new Date().toISOString(),
  }

  list.push(banner)
  await writeDB(list)
  return NextResponse.json(banner, { status: 201 })
}

export async function PUT(req: Request) {
  const payload = (await req.json()) as Partial<Banner>
  if (!payload.id) return NextResponse.json({ error: "id لازم است" }, { status: 400 })

  const list = await readDB()
  const idx = list.findIndex((b) => b.id === payload.id)
  if (idx === -1) return NextResponse.json({ error: "بنر یافت نشد" }, { status: 404 })

  const updated = { ...list[idx], ...payload }
  list[idx] = updated as Banner
  list.sort((a, b) => a.sort_order - b.sort_order)
  await writeDB(list)
  return NextResponse.json(updated)
}
