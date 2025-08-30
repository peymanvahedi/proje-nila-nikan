"use client"

import { useState } from "react"

export default function FiltersShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* دکمه فیلتر فقط برای موبایل */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="small:hidden mb-3 inline-flex items-center gap-2 rounded-lg border border-ui-border-base px-3 py-2 text-sm"
      >
        فیلترها
      </button>

      <div className={open ? "block" : "hidden small:block"}>
        {children}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-3 w-full small:hidden rounded-lg border border-ui-border-base py-2 text-sm"
        >
          بستن فیلترها
        </button>
      </div>
    </>
  )
}
