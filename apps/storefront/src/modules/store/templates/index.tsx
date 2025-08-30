import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"
import FiltersShell from "./filters-shell" // 👈 اضافه شد

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="content-container py-6" data-testid="category-container">
      <div className="grid grid-cols-1 small:grid-cols-[280px,1fr] gap-6">
        {/* فیلترها */}
        <aside className="small:sticky small:top-24 self-start">
          <div className="rounded-2xl border border-ui-border-base bg-ui-bg-base p-3 small:p-4">
            <FiltersShell>
              <RefinementList sortBy={sort} />
            </FiltersShell>
          </div>
        </aside>

        {/* محصولات */}
        <section className="min-w-0">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts sortBy={sort} page={pageNumber} countryCode={countryCode} />
          </Suspense>
        </section>
      </div>
    </div>
  )
}

export default StoreTemplate
