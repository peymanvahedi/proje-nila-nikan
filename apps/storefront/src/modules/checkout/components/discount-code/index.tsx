"use client"

import { Badge, Heading, Input, Label, Text } from "@medusajs/ui"
import React from "react"

import { applyPromotions } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const { promotions = [] } = cart

  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter((promotion) => promotion.code !== code)
    await applyPromotions(validPromotions.filter((p) => p.code === undefined).map((p) => p.code!))
  }

  const addPromotionCode = async (formData: FormData) => {
    setErrorMessage("")
    const code = formData.get("code")
    if (!code) return

    const input = document.getElementById("promotion-input") as HTMLInputElement
    const codes = promotions.filter((p) => p.code === undefined).map((p) => p.code!)
    codes.push(code.toString())

    try {
      await applyPromotions(codes)
    } catch (e: any) {
      setErrorMessage(e.message)
    }
    if (input) input.value = ""
  }

  return (
    <div className="w-full bg-white flex flex-col text-right">
      <div className="txt-medium">
        <form action={(a) => addPromotionCode(a)} className="w-full mb-5">
          <Label className="flex gap-x-1 my-2 items-center justify-end">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="txt-medium text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="add-discount-button"
            >
              افزودن کد تخفیف
            </button>
          </Label>

          {isOpen && (
            <>
              <div className="flex w-full gap-x-2">
                <Input
                  className="size-full"
                  id="promotion-input"
                  name="code"
                  type="text"
                  placeholder="کد تخفیف را وارد کنید"
                  autoFocus={false}
                  data-testid="discount-input"
                />
                <SubmitButton variant="secondary" data-testid="discount-apply-button">
                  اعمال
                </SubmitButton>
              </div>

              <ErrorMessage error={errorMessage} data-testid="discount-error-message" />
            </>
          )}
        </form>

        {promotions.length > 0 && (
          <div className="w-full flex items-center">
            <div className="flex flex-col w-full">
              <Heading className="txt-medium mb-2">کدهای اعمال‌شده:</Heading>

              {promotions.map((promotion) => {
                const val = Number(promotion.application_method?.value ?? 0) // ✅ به عدد تبدیل شد
                const curr = promotion.application_method?.currency_code

                return (
                  <div
                    key={promotion.id}
                    className="flex items-center justify-between w-full max-w-full mb-2"
                    data-testid="discount-row"
                  >
                    <Text className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                      <span className="truncate" data-testid="discount-code">
                        <Badge color={promotion.is_automatic ? "green" : "grey"} size="small">
                          {promotion.code}
                        </Badge>{" "}
                        (
                        {promotion.application_method?.value !== undefined && curr !== undefined && (
                          <>
                            {promotion.application_method?.type === "percentage"
                              ? `${val}%`
                              : convertToLocale({
                                  amount: val, // ✅ number
                                  currency_code: curr!,
                                })}
                          </>
                        )}
                        )
                      </span>
                    </Text>

                    {!promotion.is_automatic && (
                      <button
                        className="flex items-center"
                        onClick={() => {
                          if (!promotion.code) return
                          removePromotionCode(promotion.code)
                        }}
                        data-testid="remove-discount-button"
                        title="حذف کد تخفیف"
                        aria-label="حذف کد تخفیف از سفارش"
                      >
                        <Trash size={14} />
                        <span className="sr-only">حذف کد تخفیف از سفارش</span>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscountCode
