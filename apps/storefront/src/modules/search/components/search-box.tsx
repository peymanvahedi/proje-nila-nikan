"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Prod = { id: string; title: string; handle: string; thumbnail?: string | null }

const normalizeFa = (s: string) =>
  s
    .toLowerCase()
    .replace(/\u200c/g, "") // ZWNJ
    .replace(/[يۍ]/g, "ی")
    .replace(/[كڪ]/g, "ک")
    .replace(/\s+/g, " ")
    .trim()

export default function SearchBox({
  placeholder = "جست‌وجوی محصولات…",
  className = "",
  preload = 200,
  serverLimit = 8,
  regionId,
}: {
  placeholder?: string
  className?: string
  preload?: number
  serverLimit?: number
  regionId?: string
}) {
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<Prod[]>([])
  const [cursor, setCursor] = useState(-1)
  const [index, setIndex] = useState<Prod[] | null>(null)

  const wrapRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const inflight = useRef<AbortController | null>(null)
  const fetchedIndex = useRef(false)

  const router = useRouter()
  const { countryCode } = useParams<{ countryCode: string }>()

  // دی‌بونس سبک
  const [qDebounced, setQDebounced] = useState("")
  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q), 150)
    return () => clearTimeout(t)
  }, [q])

  // اگر region عوض شد، اجازه دهد دوباره ایندکس‌گیری شود
  useEffect(() => {
    fetchedIndex.current = false
  }, [regionId])

  // ایندکس محلی با اولین فوکوس
  const ensureIndex = async () => {
    if (fetchedIndex.current) return
    fetchedIndex.current = true
    try {
      if (typeof window === "undefined") return
      const url = new URL(`/api/search`, window.location.origin)
      url.searchParams.set("limit", String(preload))
      url.searchParams.set("order", "-created_at")
      url.searchParams.set("fields", "id,handle,title,thumbnail")
      if (regionId) url.searchParams.set("region_id", regionId)
      const res = await fetch(url.toString(), { cache: "no-store" })
      const data = await res.json()
      const arr: Prod[] = (data?.products || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        handle: p.handle,
        thumbnail: p.thumbnail || null,
      }))
      setIndex(arr)
    } catch {
      setIndex([])
    }
  }

  // جست‌وجو
  useEffect(() => {
    const term = qDebounced.trim()
    const limit = Math.max(1, serverLimit | 0)

    if (!term) {
      setItems([])
      setOpen(false)
      setCursor(-1)
      inflight.current?.abort()
      return
    }

    // فیلتر سریع محلی
    if (index && index.length) {
      const nt = normalizeFa(term)
      const local = index.filter((p) => normalizeFa(p.title).includes(nt)).slice(0, limit)
      setItems(local)
      setOpen(true)
      setCursor(-1)
    }

    // درخواست سمت سرور
    inflight.current?.abort()
    const controller = new AbortController()
    inflight.current = controller

    ;(async () => {
      try {
        setLoading(true)
        if (typeof window === "undefined") return
        const url = new URL(`/api/search`, window.location.origin)
        url.searchParams.set("q", term)
        url.searchParams.set("limit", String(limit))
        url.searchParams.set("fields", "id,handle,title,thumbnail")
        if (regionId) url.searchParams.set("region_id", regionId)

        const res = await fetch(url.toString(), {
          signal: controller.signal,
          cache: "no-store",
        })
        if (!res.ok) throw new Error("search_failed")
        const data = await res.json()
        const serverItems: Prod[] = (data?.products || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          handle: p.handle,
          thumbnail: p.thumbnail || null,
        }))

        if (!controller.signal.aborted) {
          if (serverItems.length) {
            setItems(serverItems)
          } else if (!index || !index.length) {
            setItems([])
          }
          setOpen(true)
          setCursor(-1)
        }
      } catch {
        // در خطا، نتایج محلی اگر هست باقی می‌ماند
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    })()

    return () => controller.abort()
  }, [qDebounced, index, serverLimit, regionId])

  // بستن با کلیک بیرون
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
        setCursor(-1)
      }
    }
    window.addEventListener("mousedown", onClick)
    return () => window.removeEventListener("mousedown", onClick)
  }, [])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || (!items.length && !loading)) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setCursor((c) => Math.min(c + 1, Math.max(items.length - 1, -1)))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setCursor((c) => Math.max(c - 1, -1))
    } else if (e.key === "Enter") {
      const term = q.trim()
      if (cursor >= 0 && items[cursor]) {
        router.push(`/${countryCode}/products/${items[cursor].handle}`)
      } else if (term) {
        router.push(`/${countryCode}/search?q=${encodeURIComponent(term)}`)
      }
    } else if (e.key === "Escape") {
      setOpen(false)
      setCursor(-1)
      inputRef.current?.blur()
    }
  }

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <input
        ref={inputRef}
        name="q"
        dir="rtl"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={ensureIndex}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full h-10 small:h-11 rounded-md border border-ui-border-base bg-white pl-10 pr-4 text-[13px] small:text-sm text-right placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="searchbox-listbox"
      />

      {/* آیکن ذره‌بین سمت چپ */}
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-60" aria-hidden="true">
          <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79l5 4.99L20.49 19zM9.5 14A4.5 4.5 0 1 1 14 9.5A4.505 4.505 0 0 1 9.5 14"/>
        </svg>
      </div>

      {/* نتایج */}
      {open && (
        <div
          id="searchbox-listbox"
          role="listbox"
          className="absolute z-50 mt-2 w-full max-h-96 overflow-auto rounded-xl border bg-white shadow-lg"
        >
          {loading && <div className="px-4 py-3 text-sm text-ui-fg-subtle">درحال جست‌وجو…</div>}

          {!loading && items.length === 0 && (
            <div className="px-4 py-3 text-sm text-ui-fg-subtle">نتیجه‌ای پیدا نشد.</div>
          )}

          {!loading &&
            items.map((p, i) => (
              <LocalizedClientLink
                key={p.id}
                href={`/products/${p.handle}`}
                className={`flex items-center gap-3 px-3 py-2 hover:bg-pink-50 ${i === cursor ? "bg-pink-50" : ""}`}
                onMouseEnter={() => setCursor(i)}
                role="option"
                aria-selected={i === cursor}
              >
                <div className="h-10 w-10 rounded-md border bg-ui-bg-subtle overflow-hidden shrink-0">
                  {p.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.thumbnail} alt={p.title} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="flex-1 text-[13px] small:text-sm text-ui-fg-base text-right">
                  {p.title}
                </div>
              </LocalizedClientLink>
            ))}

          {!loading && q.trim().length >= 1 && (
            <LocalizedClientLink
              href={`/search?q=${encodeURIComponent(q.trim())}`}
              className="block text-center text-pink-600 hover:bg-pink-50 px-3 py-2 text-sm border-t"
            >
              نمایش همه نتایج برای «{q.trim()}»
            </LocalizedClientLink>
          )}
        </div>
      )}
    </div>
  )
}
