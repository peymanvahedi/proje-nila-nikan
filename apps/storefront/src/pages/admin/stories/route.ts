import { NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

async function readItems() {
  const p = path.join(process.cwd(), "public", "uploads", "stories", "stories.json")
  try {
    const raw = await fs.readFile(p, "utf-8")
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : data.items || []
  } catch {
    return []
  }
}

async function writeItems(items: any[]) {
  const dir = path.join(process.cwd(), "public", "uploads", "stories")
  await fs.mkdir(dir, { recursive: true })
  const p = path.join(dir, "stories.json")
  const json = JSON.stringify({ items }, null, 2)
  await fs.writeFile(p, json, "utf-8")
}

export async function GET(req: Request) {
  if (req.headers.get("x-admin-key") !== process.env.ADMIN_KEY) return unauthorized()
  const items = await readItems()
  return NextResponse.json({ items }, { status: 200 })
}

export async function POST(req: Request) {
  if (req.headers.get("x-admin-key") !== process.env.ADMIN_KEY) return unauthorized()
  const body = await req.json().catch(() => ({}))
  const items = Array.isArray(body?.items) ? body.items : []
  await writeItems(items)
  return NextResponse.json({ saved: true, count: items.length }, { status: 200 })
}
