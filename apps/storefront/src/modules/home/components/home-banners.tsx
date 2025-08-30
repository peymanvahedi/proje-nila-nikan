"use client"

import { useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Banner = {
  id: string
  title: string
  subtitle?: string
  link?: string
  image_url: string
  sort_order?: number
  created_at?: string
}

export default function HomeBanners() {
  const [banners, setBanners] = useState<Banner[] | null>(null)

  const toSrc = (u: string) => {
    if (!u) return ""
    if (u.startsWith("http")) return u
    return u.startsWith("/") ? u : `${process.env.NEXT_PUBLIC_BASE_URL || ""}${u}`
  }

  useEffect(() => {
    let ok = true
    ;(async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9000"
        const r = await fetch(`${base}/store/banners`, { cache: "no-store" })
        const data = r.ok ? await r.json() : null
        const list: Banner[] = data?.banners ?? data?.items ?? (Array.isArray(data) ? data : [])

        const sorted = list
          .filter((b) => b?.image_url)
          .sort(
            (a, b) =>
              (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
              (Date.parse(b.created_at ?? "") - Date.parse(a.created_at ?? ""))
          )

        ok && setBanners(sorted)
      } catch {
        ok && setBanners([])
      }
    })()
    return () => {
      ok = false
    }
  }, [])

  if (banners === null) {
    return (
      <section className="content-container my-4 sm:my-6">
        <div className="aspect-[21/9] rounded-2xl bg-ui-bg-subtle animate-pulse" />
      </section>
    )
  }

  if (!banners.length) return null

  const hero = banners[0]
  const rest = banners.slice(1, 5)

  return (
    <>
      <section className="content-container my-4 sm:my-6">
        <LocalizedClientLink
          href={hero.link || "/store"}
          aria-label={hero.title}
          className="block overflow-hidden rounded-2xl border border-ui-border-base"
        >
          <div
            className="aspect-[21/9] bg-center bg-cover"
            style={{ backgroundImage: `url("${toSrc(hero.image_url)}")` }}
            role="img"
            aria-label={hero.title}
          />
        </LocalizedClientLink>
      </section>

      {rest.length > 0 && (
        <section className="content-container my-2 sm:my-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {rest.map((b) => (
              <LocalizedClientLink
                key={b.id}
                href={b.link || "/store"}
                className="block rounded-2xl border border-ui-border-base overflow-hidden"
                aria-label={b.title}
              >
                <div
                  className="aspect-[4/3] bg-center bg-cover"
                  style={{ backgroundImage: `url("${toSrc(b.image_url)}")` }}
                  role="img"
                  aria-label={b.title}
                />
              </LocalizedClientLink>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
