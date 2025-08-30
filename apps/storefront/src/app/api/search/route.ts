import { NextResponse } from "next/server"

const MEDUSA_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  process.env.MEDUSA_BACKEND_URL ||
  "http://localhost:9000"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") ?? undefined
  const limit = searchParams.get("limit") ?? "8"
  const order = searchParams.get("order") ?? undefined
  const fields = searchParams.get("fields") ?? "id,handle,title,thumbnail"
  const region_id = searchParams.get("region_id") ?? undefined

  const url = new URL(`${MEDUSA_URL}/store/products`)
  if (q) url.searchParams.set("q", q)
  if (region_id) url.searchParams.set("region_id", region_id)
  url.searchParams.set("limit", limit)
  if (order) url.searchParams.set("order", order)
  url.searchParams.set("fields", fields)

  try {
    const res = await fetch(url.toString(), { cache: "no-store" })
    const data = await res.json()
    return NextResponse.json({
      products: data?.products ?? [],
      count: data?.count ?? 0,
    })
  } catch {
    // در صورت خطا، خالی برگردان تا UI کرش نکند
    return NextResponse.json({ products: [], count: 0 })
  }
}
