import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import Controls from "./controls"

export default async function LatestProductsSlider({
  region,
  limit = 12,
}: {
  region: HttpTypes.StoreRegion
  limit?: number
}) {
  try {
    // ✅ مدوسا: برای نزولی از جدیدترین‌ها از order: "-created_at" استفاده کن
    const params: HttpTypes.StoreProductListParams = {
      limit,
      order: "-created_at",
    }

    const {
      response: { products = [] },
    } = await listProducts({
      pageParam: 0,
      regionId: region.id,
      noStore: true,
      queryParams: params,
    })

    if (!products.length) return null

    const targetId = "latest-products-slider"

    return (
      <section className="content-container py-10 small:py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="txt-xlarge">جدیدترین محصولات</h2>
          <Controls targetId={targetId} />
        </div>

        <ul
          id={targetId}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
        >
          {products.map((p, idx) => (
            <li
              id={`p-${idx}`}
              key={p.id}
              className="snap-start min-w-[72%] md:min-w-[40%] lg:min-w-[23%]"
            >
              <ProductPreview product={p} region={region} isFeatured />
            </li>
          ))}
        </ul>

        <div className="mt-4 flex justify-center gap-2">
          {products.map((_, idx) => (
            <a
              key={idx}
              href={`#p-${idx}`}
              className="h-2 w-2 rounded-full bg-ui-bg-base/60 hover:bg-ui-fg-subtle transition"
              aria-label={`اسلاید ${idx + 1}`}
            />
          ))}
        </div>
      </section>
    )
  } catch (e) {
    // اگر بک‌اند چیزی برگردونه که کرش بده، صفحه نمی‌ترکه و فقط سکشن مخفی میشه
    console.error("LatestProductsSlider failed:", e)
    return null
  }
}
