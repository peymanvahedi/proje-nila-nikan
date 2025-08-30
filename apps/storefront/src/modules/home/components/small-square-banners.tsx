"use client"

export default function SmallSquareBanners() {
  return (
    <section className="content-container my-4 small:my-6">
      <div className="grid grid-cols-2 small:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <a key={i} href="/store" className="block rounded-2xl border border-ui-border-base">
            <div className="aspect-square bg-ui-bg-subtle" />
          </a>
        ))}
      </div>
    </section>
  )
}
