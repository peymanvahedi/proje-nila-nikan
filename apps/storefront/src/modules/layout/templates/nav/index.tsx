import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SideMenu from "@modules/layout/components/side-menu"
import SearchBox from "@modules/search/components/search-box" // ✅ جست‌وجوی زنده

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  const categories = [
    { title: "کالکشن ویژه پاییزه 1404", href: "/collections/fall-1404" },
    { title: "پرطرفدارترین ست های پاییزه", href: "/collections/fall-best" },
    { title: "کالکشن بهار و تابستانه", href: "/collections/spring-summer" },
    { title: "پکیج VIP نیلا نیکان", href: "/collections/vip" },
    { title: "ست های مهمانی و خاص", href: "/collections/party" },
    { title: "لباس های مجلسی جدید", href: "/collections/formal" },
    { title: "کاپشن و پافر", href: "/collections/jackets" },
    { title: "دورس و هودی", href: "/collections/hoodies" },
    { title: "شومیز چهارخانه و کشمیر", href: "/collections/shirts" },
    { title: "شلوارهای جین و کتان", href: "/collections/pants" },
    { title: "کفش (کتونی, کالج, بوت, صندل)", href: "/collections/shoes" },
    { title: "اکسسوری", href: "/collections/accessories" },
    { title: "حراج بزرگ تک سایزها", href: "/collections/sale" },
  ]

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      {/* نوار بالای هدر */}
      <div className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white">
        <div className="content-container">
          <div className="flex items-center justify-center gap-2 py-2.5 text-sm small:text-[15px] font-semibold">
            <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
              <path fill="currentColor" d="M20 8h-3V5H3v11h1a3 3 0 0 0 6 0h4a3 3 0 0 0 6 0h1v-5zm-1 2v3h-3v-3zm-10 6a1 1 0 1 1-1-1a1 1 0 0 1 1 1m10 0a1 1 0 1 1-1-1a1 1 0 0 1 1 1" />
            </svg>
            <span><b>ارسال رایگان</b> برای سفارش‌های بالای <b>دو میلیون تومان</b></span>
          </div>
        </div>
      </div>

      <header className="relative mx-auto bg-white border-b border-ui-border-base">
        {/* ترتیب دقیق: [چپ: سبد+ورود] [وسط: جست‌وجو زنده] [راست: لوگو] */}
        <nav className="content-container h-16 small:h-20 grid grid-cols-[auto,1fr,auto] items-center gap-3">
          {/* چپ: سبد + ورود */}
          <div className="flex items-center gap-4">
            <LocalizedClientLink href="/cart" aria-label="سبد خرید" className="hover:text-ui-fg-base">
              <svg width="22" height="22" viewBox="0 0 24 24" className="opacity-80">
                <path fill="currentColor" d="M7 18a2 2 0 1 0 2 2a2 2 0 0 0-2-2m10 0a2 2 0 1 0 2 2a2 2 0 0 0-2-2M7.17 14h9.65a2 2 0 0 0 1.92-1.47l1.26-4.73A1 1 0 0 0 19 6H6.21l-.38-2H3v2h1.38l2.2 9.59A3 3 0 0 0 9.5 18H19v-2H9.5a1 1 0 0 1-1-.76z"/>
              </svg>
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/account"
              className="inline-flex items-center gap-2 rounded-md border border-pink-500 text-pink-600 px-5 py-1.5 text-sm hover:bg-pink-50 transition-colors"
            >
              ورود
              <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-90">
                <path fill="currentColor" d="M10 17l1.41-1.41L8.83 13H20v-2H8.83l2.58-2.59L10 7l-5 5z" />
              </svg>
            </LocalizedClientLink>

            {/* منوی موبایل (اختیاری) */}
            <div className="small:hidden">
              <SideMenu regions={regions} />
            </div>
          </div>

          {/* وسط: جست‌وجوی زنده (Autocomplete) */}
          <div className="px-2 relative">
            <SearchBox placeholder="جست‌وجوی محصولات، دسته‌ها و برندها…" />
          </div>

          {/* راست: لوگو */}
          <div className="flex justify-end">
            <LocalizedClientLink href="/" data-testid="nav-store-link" className="select-none">
              {/* اگر لوگو تصویری داری، img را جایگزین کن */}
              <span className="text-pink-600 font-extrabold text-2xl small:text-3xl leading-none">
                نیلا نیکان
              </span>
              {/* مثال: <img src="/logo.svg" alt="نیلا نیکان" className="h-8 small:h-9" /> */}
            </LocalizedClientLink>
          </div>
        </nav>

        {/* خط گرادیانی صورتی بالای نوار دسته‌ها */}
        <div className="w-full h-1.5 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500" />

        {/* نوار دسته‌ها */}
        <div className="w-full bg-neutral-900">
          <div
            className="content-container flex overflow-x-auto py-3 items-center text-xs small:text-sm text-white"
            style={{ scrollbarWidth: "thin" }}
          >
            {categories.map((c, idx) => (
              <div key={c.href} className="flex items-center">
                <LocalizedClientLink
                  href={c.href}
                  className="shrink-0 whitespace-nowrap hover:text-pink-300 px-3"
                >
                  {c.title}
                </LocalizedClientLink>
                {idx !== categories.length - 1 && <div className="h-5 w-px bg-white mx-2" />}
              </div>
            ))}
          </div>
        </div>
      </header>
    </div>
  )
}
