"use client"

import React, { useRef, useEffect, forwardRef } from "react"
import clsx from "clsx"

type Props = {
  children: React.ReactNode
  className?: string
  "aria-label"?: string
  hideScrollbar?: boolean
}

/** ردیف اسکرولی: اسنپ + اسکرول افقی + درَگ طبیعی (+ امکان مخفی کردن اسکرول‌بار) */
const ScrollRow = forwardRef<HTMLDivElement, Props>(
  ({ children, className, hideScrollbar, ...rest }, refFromParent) => {
    const innerRef = useRef<HTMLDivElement>(null)

    // پل‌دادن ref بیرونی به div داخلی
    useEffect(() => {
      if (!refFromParent) return
      if (typeof refFromParent === "function") {
        refFromParent(innerRef.current)
      } else {
        ;(refFromParent as React.MutableRefObject<HTMLDivElement | null>).current =
          innerRef.current
      }
    }, [refFromParent])

    useEffect(() => {
      const el = innerRef.current
      if (!el) return

      let isDown = false
      let startX = 0
      let startLeft = 0

      const down = (e: PointerEvent) => {
        if (e.pointerType === "mouse" && e.button !== 0) return
        isDown = true
        startX = e.clientX
        startLeft = el.scrollLeft
        el.setPointerCapture?.(e.pointerId)
        el.style.cursor = "grabbing"
      }
      const move = (e: PointerEvent) => {
        if (!isDown) return
        if (e.pointerType === "mouse" && e.buttons !== 1) {
          up(e)
          return
        }
        const dx = e.clientX - startX
        el.scrollLeft = startLeft - dx
      }
      const up = (e: PointerEvent) => {
        if (!isDown) return
        isDown = false
        el.releasePointerCapture?.(e.pointerId)
        el.style.cursor = ""
      }

      el.addEventListener("pointerdown", down, { passive: true })
      el.addEventListener("pointermove", move, { passive: true })
      el.addEventListener("pointerup", up, { passive: true })
      el.addEventListener("pointercancel", up, { passive: true })
      el.addEventListener("pointerleave", up, { passive: true })

      return () => {
        el.removeEventListener("pointerdown", down)
        el.removeEventListener("pointermove", move)
        el.removeEventListener("pointerup", up)
        el.removeEventListener("pointercancel", up)
        el.removeEventListener("pointerleave", up)
      }
    }, [])

    return (
      <div
        ref={innerRef}
        {...rest}
        className={clsx(
          "flex gap-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth",
          "rounded-2xl border border-ui-border-base p-0",
          hideScrollbar ? "no-scrollbar" : "scrollbar-horizontal",
          "select-none cursor-grab active:cursor-grabbing",
          className
        )}
      >
        {children}
      </div>
    )
  }
)

ScrollRow.displayName = "ScrollRow"
export default ScrollRow
