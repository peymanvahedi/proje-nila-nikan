"use client"

import { useCallback } from "react"

export default function Controls({ targetId }: { targetId: string }) {
  const scrollBy = useCallback(
    (dir: "prev" | "next") => {
      const el = document.getElementById(targetId)
      if (!el) return
      const card = el.querySelector("li")
      const step = card ? (card as HTMLElement).offsetWidth + 16 : 320
      el.scrollBy({ left: dir === "next" ? step : -step, behavior: "smooth" })
    },
    [targetId]
  )

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => scrollBy("prev")}
        className="rounded-full border px-3 py-1 text-sm hover:bg-ui-bg-subtle"
        aria-label="قبلی"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scrollBy("next")}
        className="rounded-full border px-3 py-1 text-sm hover:bg-ui-bg-subtle"
        aria-label="بعدی"
      >
        ›
      </button>
    </div>
  )
}
