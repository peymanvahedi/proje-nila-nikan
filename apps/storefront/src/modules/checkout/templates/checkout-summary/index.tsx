import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  if (!cart) return null

  return (
    <div className="sticky top-6">
      {/* کارتِ خلاصه سفارش - راست‌چین و تمیز */}
      <div className="w-full bg-white rounded-2xl shadow-sm border p-6 space-y-6 text-right">
        <Heading level="h2" className="text-2xl font-semibold">
          سبد خرید شما
        </Heading>

        <Divider />

        <CartTotals totals={cart} />

        <ItemsPreviewTemplate cart={cart} />

        <div>
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
