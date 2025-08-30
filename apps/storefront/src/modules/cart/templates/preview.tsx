"use client"

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Table, clx } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart: HttpTypes.StoreCart
}

const ItemsPreviewTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart.items
  const hasOverflow = items && items.length > 4

  return (
    <div
      className={clx(
        "rounded-2xl border bg-white",
        hasOverflow && "pl-[1px] overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]"
      )}
    >
      {/* هدر فارسی استیکی و راست‌چین (بیرون از Table) */}
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-4 py-3 text-right text-sm text-ui-fg-subtle bg-gray-50/80 backdrop-blur rounded-t-2xl sticky top-0 z-10">
        <span>محصول</span>
        <span>تعداد</span>
        <span>قیمت کل</span>
      </div>

      <Table>
        <Table.Body data-testid="items-table">
          {items
            ? items
                .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
                .map((item) => (
                  <Item
                    key={item.id}
                    item={item}
                    type="preview"
                    currencyCode={cart.currency_code}
                  />
                ))
            : repeat(5).map((i) => <SkeletonLineItem key={i} />)}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsPreviewTemplate
