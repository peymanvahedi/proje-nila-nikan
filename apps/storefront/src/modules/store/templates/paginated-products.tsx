// src/modules/store/templates/paginated-products.tsx
import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import type { HttpTypes } from "@medusajs/types"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

function getPriceInfo(p: HttpTypes.StoreProduct, regionCurrency: string) {
  let amount: number | null = null
  let compareAt: number | null = null
  let currency = regionCurrency

  for (const v of p.variants ?? []) {
    const calc = (v as any)?.calculated_price
    if (calc?.calculated_amount != null) {
      const a = Number(calc.calculated_amount)
      if (amount == null || a < amount) {
        amount = a
        currency = calc.currency_code ?? regionCurrency
        const cmp = Number(calc.original_amount ?? calc.calculated_amount)
        compareAt = cmp > a ? cmp : null
      }
    }
    const price = (v as any)?.prices?.[0]
    if (price?.amount != null && (amount == null || price.amount < amount)) {
      amount = Number(price.amount)
      currency = price.currency_code ?? regionCurrency
    }
  }
  return { amount, compareAt, currency }
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
}) {
  const currentPage = Math.max(1, Number(page) || 1)

  const queryParams: PaginatedProductsParams = { limit: PRODUCT_LIMIT }
  if (collectionId) queryParams.collection_id = [collectionId]
  if (categoryId) queryParams.category_id = [categoryId]
  if (productsIds?.length) queryParams.id = productsIds
  if (!sortBy || sortBy === "created_at") queryParams.order = "-created_at"

  const region = await getRegion(countryCode)
  if (!region) return null

  const {
    response: { products, count },
  } = await listProductsWithSort({
    page: currentPage,
    queryParams,
    sortBy: sortBy ?? "created_at",
    countryCode,
    noStore: true,
  })

  const totalPages = Math.ceil((count || 0) / PRODUCT_LIMIT)

  return (
    <>
      <ul
        className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-5 gap-x-4 gap-y-6"
        data-testid="products-list"
      >
        {products?.map((p) => {
          const { amount, compareAt, currency } = getPriceInfo(p, region.currency_code)
          const discount =
            amount != null && compareAt ? Math.max(0, Math.round(((compareAt - amount) / compareAt) * 100)) : 0
          const meta = (p.metadata ?? {}) as Record<string, any> // 👈 حلِ TypeScript (unknown → Record)

          return (
            <li key={p.id}>
              <LocalizedClientLink
                href={`/products/${p.handle}`}
                className="group block overflow-hidden rounded-xl border border-ui-border-base bg-white transition hover:shadow-md"
              >
                {/* تصویر کوچک‌تر + برچسب‌ها */}
                <div className="relative aspect-square small:aspect-[4/5] bg-ui-bg-subtle">
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 rounded-full bg-rose-600 px-2 py-0.5 text-xs text-white">
                      %{discount}
                    </span>
                  )}
                  {meta?.badge && (
                    <span className="absolute top-2 right-2 rounded-full bg-neutral-800/90 px-2 py-0.5 text-[11px] text-white">
                      {String(meta.badge)}
                    </span>
                  )}
                  <img
                    src={p.thumbnail || "/placeholder.png"}
                    alt={p.title}
                    className="h-full w-full object-contain p-3 transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* متن و قیمت‌ها */}
                <div className="p-3 small:p-4">
                  <div className="text-[11px] text-ui-fg-subtle">
                    {p.collection?.title || p.subtitle || "\u00A0"}
                  </div>
                  <div className="mt-1 line-clamp-2 text-sm font-medium text-ui-fg-base">
                    {p.title}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    {discount > 0 && compareAt != null && (
                      <span className="line-through text-xs text-ui-fg-muted">
                        {new Intl.NumberFormat("fa-IR", { style: "currency", currency }).format(compareAt / 100)}
                      </span>
                    )}
                    <span className="text-sm font-bold text-rose-600">
                      {amount != null
                        ? new Intl.NumberFormat("fa-IR", { style: "currency", currency }).format(amount / 100)
                        : "—"}
                    </span>
                  </div>
                </div>
              </LocalizedClientLink>
            </li>
          )
        })}
      </ul>

      {totalPages > 1 && (
        <Pagination data-testid="product-pagination" page={currentPage} totalPages={totalPages} />
      )}
    </>
  )
}
