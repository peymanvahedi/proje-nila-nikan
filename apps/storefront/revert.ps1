# ---------- paths ----------
$root = Get-Location
$src = Join-Path $root "src"
$appMain = Join-Path $src "app\[countryCode]\(main)"
$modules = Join-Path $src "modules"
$heroBanner = Join-Path $modules "home\components\hero\hero-banner.tsx"
$smallSq = Join-Path $modules "home\components\small-square-banners.tsx"
$imgUtil = Join-Path $src "lib\utils\image.ts"
$tsconfig = Join-Path $root "tsconfig.json"
$nextcfg  = Join-Path $root "next.config.js"
$page = Join-Path $appMain "page.tsx"

# ---------- 1) page.tsx (HeroCarousel + await params) ----------
$pageContent = @"
import { Metadata } from "next"
import LatestProductsSlider from "@modules/home/components/latest-products-slider"
import { getRegion } from "@lib/data/regions"
import SmallSquareBanners from "@modules/home/components/small-square-banners"
import HeroCarousel from "@modules/home/components/hero/hero-carousel"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "پوشاک کودک | شاد، راحت و استاندارد",
  description: "صفحهٔ اصلی فروشگاه پوشاک کودک: جدیدترین‌ها، دسته‌بندی‌های محبوب، راهنمای سایز استاندارد و پیشنهادهای ویژه.",
  openGraph: { title: "پوشاک کودک | شاد، راحت و استاندارد", description: "خرید آنلاین لباس نوزاد، دخترانه و پسرانه با ارسال سریع و ضمانت بازگشت.", type: "website" },
  twitter: { card: "summary_large_image", title: "پوشاک کودک | شاد، راحت و استاندارد", description: "کالکشن‌های فصل و جدیدترین محصولات" },
}

function StoriesBar() {
  const items = [{ t: "جدیدترین‌ها" }, { t: "نوزادی" }, { t: "دخترانه" }, { t: "پسرانه" }, { t: "مدرسه" }, { t: "ورزشی" }, { t: "مهمانی" }, { t: "اکسسوری" }]
  return (
    <section className="content-container py-4 small:py-5">
      <div className="flex gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "thin" }} aria-label="استوری‌ها">
        {items.map((it, i) => (
          <a key={i} href="/store" className="group inline-flex shrink-0 flex-col items-center justify-center">
            <div className="relative">
              <div className="h-16 w-16 small:h-20 small:w-20 rounded-full bg-gradient-to-tr from-pink-400 via-fuchsia-500 to-yellow-400 p-0.5">
                <div className="h-full w-full rounded-full bg-ui-bg-base flex items-center justify-center border border-ui-border-base">
                  <div className="h-12 w-12 small:h-14 small:w-14 rounded-full bg-ui-bg-subtle" />
                </div>
              </div>
              <span className="pointer-events-none absolute inset-0 rounded-full ring-0 group-hover:ring-2 ring-pink-300/40 transition" />
            </div>
            <div className="mt-2 text-xs small:text-[13px] text-ui-fg-base">{it.t}</div>
          </a>
        ))}
      </div>
    </section>
  )
}

function TrustBar() {
  const items = [{ title: "ارسال سریع", sub: "تحویل فوری" }, { title: "کیفیت تضمین‌شده", sub: "دوخت استاندارد" }, { title: "۷ روز بازگشت", sub: "بدون دردسر" }]
  return (
    <div className="content-container my-4 small:my-6">
      <div className="grid grid-cols-3 gap-2 small:gap-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-xl border border-ui-border-base bg-ui-bg-base p-3 text-center">
            <div className="text-[13px] small:text-sm font-medium">{it.title}</div>
            <div className="text-[11px] small:text-xs text-ui-fg-subtle mt-0.5">{it.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CategoryTiles() {
  const items = [{ title: "نوزادی", href: "/categories/baby" }, { title: "دخترانه", href: "/categories/girls" }, { title: "پسرانه", href: "/categories/boys" }]
  return (
    <section className="content-container my-8 small:my-12">
      <h2 className="txt-xlarge mb-6">برای چه سنی/سبکی می‌خوای؟</h2>
      <ul className="grid grid-cols-2 small:grid-cols-3 gap-4">
        {items.map((it) => (
          <li key={it.href}>
            <a href={it.href} className="block rounded-2xl border border-ui-border-base p-6 small:p-8 hover:shadow-md transition-shadow bg-ui-bg-base h-full">
              <div className="aspect-[4/3] rounded-xl bg-ui-bg-subtle mb-4" />
              <div className="text-ui-fg-base font-medium">{it.title}</div>
              <div className="text-ui-fg-subtle text-sm mt-1">مشاهده</div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

function PromoBanner() {
  return (
    <section className="content-container">
      <div className="rounded-2xl border border-dashed border-ui-border-base p-5 small:p-7 flex flex-col small:flex-row small:items-center small:justify-between gap-4 bg-ui-bg-subtle">
        <p className="text-ui-fg-base text-sm small:text-base">جشنواره بازگشت به مدرسه: <span className="font-medium">تا ۲۰٪ تخفیف</span> روی لباس‌های روزمره</p>
        <a href="/collections" className="text-ui-fg-interactive text-sm small:text-base underline underline-offset-4">همین حالا خرید کن</a>
      </div>
    </section>
  )
}

function BrandStrip() {
  const brands = Array.from({ length: 10 })
  return (
    <section className="content-container my-8 small:my-12">
      <div className="rounded-2xl border border-ui-border-base p-4 small:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="txt-large">برندهای پرفروش</h3>
          <a href="/brands" className="text-ui-fg-interactive underline underline-offset-4 text-sm">مشاهده همه</a>
        </div>
        <div className="flex gap-4 overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
          {brands.map((_, i) => (
            <div key={i} className="h-12 w-28 small:h-14 small:w-32 shrink-0 rounded-xl border border-ui-border-base bg-ui-bg-subtle" />
          ))}
        </div>
      </div>
    </section>
  )
}

function InstagramGrid() {
  const items = Array.from({ length: 6 })
  return (
    <section className="content-container my-10 small:my-16">
      <div className="flex items-center justify-between mb-4">
        <h3 className="txt-large">از اینستاگرام ما</h3>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="underline underline-offset-4 text-ui-fg-interactive">مشاهده پیج</a>
      </div>
      <ul className="grid grid-cols-3 small:grid-cols-6 gap-2">
        {items.map((_, i) => (
          <li key={i} className="aspect-square rounded-lg bg-ui-bg-subtle border border-ui-border-base" />
        ))}
      </ul>
    </section>
  )
}

/** ─────────────── صفحه اصلی ─────────────── */
export default async function Home({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const region = await getRegion(countryCode)
  if (!region) return null

  return (
    <>
      <StoriesBar />
      <HeroCarousel />
      <SmallSquareBanners />
      <TrustBar />
      <CategoryTiles />
      <PromoBanner />
      <LatestProductsSlider region={region} />
      <BrandStrip />
      <InstagramGrid />
    </>
  )
}
"@

$pageContent | Out-File -FilePath $page -Encoding utf8 -Force

# ---------- 2) small-square-banners.tsx (ساده) ----------
$smallSqContent = @"
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
"@

$smallSqContent | Out-File -FilePath $smallSq -Encoding utf8 -Force

# ---------- 3) حذف فایل‌های اضافی ----------
if (Test-Path $heroBanner) { Remove-Item $heroBanner -Force }
if (Test-Path $imgUtil)    { Remove-Item $imgUtil    -Force }

# ---------- 4) tsconfig.json (نسخه پایدار قبلی) ----------
$tsconfigContent = @"
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": "./src",
    "paths": {
      "@lib/*": ["lib/*"],
      "@modules/*": ["modules/*"],
      "@pages/*": ["pages/*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", ".next", ".nyc_output", "coverage", "jest-coverage"]
}
"@

$tsconfigContent | Out-File -FilePath $tsconfig -Encoding utf8 -Force

# ---------- 5) next.config.js (سبک) ----------
$nextcfgContent = @"
const checkEnvVariables = require("./check-env-variables")
checkEnvVariables()
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  logging: { fetches: { fullUrl: true } },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com" },
      { protocol: "https", hostname: "medusa-server-testing.s3.amazonaws.com" },
      { protocol: "https", hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com" }
    ],
  },
}
"@

$nextcfgContent | Out-File -FilePath $nextcfg -Encoding utf8 -Force

# ---------- 6) پاکسازی و اجرای dev ----------
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
Write-Host "Reverted. Now starting dev on port 8000..."
$env:NEXT_DISABLE_TURBOPACK="1"
npm run dev
