"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

type Slide = { src: string; alt?: string; w?: number; h?: number }

export default function HeroSlider({ slides: initial }: { slides: Slide[] }) {
  const fallback: Slide[] = [
    { src: "/uploads/banners/hero1.jpg", alt: "بنر ۱", w: 1920, h: 425 },
    { src: "/uploads/banners/hero2.jpg", alt: "بنر ۲", w: 1920, h: 425 },
  ]
  const slides = (initial && initial.length ? initial : fallback).slice(0, 9)

  const [current, setCurrent] = useState(0)

  // اتوپلی با سرعت ۵ ثانیه
  useEffect(() => {
    if (slides.length < 2) return
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [slides.length])

  if (!slides.length) return null

  const s = slides[current]
  const W = s.w ?? 1920
  const H = s.h ?? 425

  return (
    <section
      aria-label="hero"
      className="w-screen relative"
      style={{
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
        marginTop: 0,
        marginBottom: 0,
      }}
    >
      <div className="relative w-full overflow-hidden">
        <Image
          key={s.src}
          src={s.src}
          alt={s.alt || "banner"}
          width={W}
          height={H}
          priority
          sizes="(min-width:1920px) 1920px, 100vw"
          style={{ width: "100%", height: "auto", display: "block" }}
          draggable={false}
          unoptimized
        />

        {/* دات‌ها */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  idx === current ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
