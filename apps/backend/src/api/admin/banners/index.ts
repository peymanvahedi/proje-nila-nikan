// apps/backend/src/api/admin/banners/index.ts
import { Router, Request, Response } from "express"
import multer from "multer"
import fs from "fs/promises"
import path from "path"
import express from "express"

const router = Router()
const uploadDir = path.join(process.cwd(), "apps/backend/static/uploads/banners")
const dbFile = path.join(uploadDir, "banners.json")
const upload = multer({ dest: path.join(uploadDir, "_tmp") })

async function ensure() {
  await fs.mkdir(uploadDir, { recursive: true })
  try { await fs.access(dbFile) } catch { await fs.writeFile(dbFile, "[]", "utf-8") }
}
async function readDB() {
  await ensure()
  const raw = await fs.readFile(dbFile, "utf-8")
  const list = JSON.parse(raw || "[]") as any[]
  return list.sort((a, b) => a.sort_order - b.sort_order)
}
async function writeDB(list: any[]) {
  await ensure()
  await fs.writeFile(dbFile, JSON.stringify(list, null, 2), "utf-8")
}

/** GET /admin/banners */
router.get("/", async (_req: Request, res: Response) => {
  res.json(await readDB())
})

/** POST /admin/banners  (multipart: image, title, subtitle?, link?) */
router.post("/", upload.single("image"), async (req: Request, res: Response) => {
  try {
    await ensure()
const file = (req as any).file as any
    const { title = "", subtitle = "", link = "" } = (req.body || {}) as any
    if (!file || !title) return res.status(400).json({ error: "image و title لازم است" })

    const ext = (file.originalname?.split(".").pop() || "jpg").toLowerCase()
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const filename = `${id}.${ext}`
    await fs.rename(file.path, path.join(uploadDir, filename))

    const list = await readDB()
    const sort_order = (list.at(-1)?.sort_order ?? -1) + 1
    const banner = {
      id, title, subtitle, link,
      image_url: `/static/uploads/banners/${filename}`,
      sort_order,
      created_at: new Date().toISOString(),
    }
    list.push(banner)
    await writeDB(list)
    res.status(201).json(banner)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "خطا در ذخیره" })
  }
})

/** PUT /admin/banners/:id  (JSON: { title?, subtitle?, link?, sort_order? }) */
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }
  const list = await readDB()
  const i = list.findIndex((b) => b.id === id)
  if (i === -1) return res.status(404).json({ error: "یافت نشد" })
  list[i] = { ...list[i], ...(req.body || {}) }
  list.sort((a, b) => a.sort_order - b.sort_order)
  await writeDB(list)
  res.json(list[i])
})

/** DELETE /admin/banners/:id */
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }
  const list = await readDB()
  const target = list.find((b) => b.id === id)
  if (!target) return res.status(404).json({ error: "یافت نشد" })
  const filename = target.image_url.split("/").pop()
  if (filename) { try { await fs.unlink(path.join(uploadDir, filename)) } catch {} }
  await writeDB(list.filter((b) => b.id !== id))
  res.json({ ok: true })
})

export default function (rootRouter: Router) {
  rootRouter.use("/static", express.static(path.join(process.cwd(), "apps/backend/static")))
  rootRouter.use("/admin/banners", router)
  return rootRouter
}
