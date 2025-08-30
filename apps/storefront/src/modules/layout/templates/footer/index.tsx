import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

const BrandWordmark = ({ name }: { name: string }) => (
  <LocalizedClientLink
    href="/"
    className="inline-block tracking-wide uppercase text-ui-fg-base/90 hover:text-ui-fg-base focus:outline-none focus-visible:ring-2 focus-visible:ring-ui-fg-subtle rounded"
    aria-label={`${name} homepage`}
  >
    <span className="text-[22px] font-extrabold hero-gradient bg-clip-text text-transparent">
      {name}
    </span>
  </LocalizedClientLink>
)

const SocialIcon = ({
  label,
  href,
  children,
}: {
  label: string
  href: string
  children: React.ReactNode
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    aria-label={label}
    className="group inline-flex h-9 w-9 items-center justify-center rounded-full bg-ui-bg-subtle/60 border border-ui-border-base/60 shadow-sm hover:shadow-md ring-0 hover:ring-2 hover:ring-ui-fg-subtle transition-all duration-200"
  >
    <span className="text-ui-fg-muted group-hover:text-ui-fg-base transition-colors duration-200">
      {children}
    </span>
  </a>
)

export default async function Footer() {
  const { collections } = await listCollections({ fields: "*products" })
  const productCategories = await listCategories()

  const brandName = "نیلا نیکان"

  const topCategories =
    productCategories
      ?.filter((c) => !c.parent_category)
      .slice(0, 6)
      .map((c) => ({
        id: c.id,
        name: c.name,
        handle: c.handle,
        children:
          c.category_children?.map((child) => ({
            id: child.id,
            name: child.name,
            handle: child.handle,
          })) || [],
      })) || []

  const topCollections = collections?.slice(0, 6) || []

  return (
    <footer
      className={clx(
        "relative w-full border-t border-ui-border-base overflow-hidden",
        // لایه‌های پس‌زمینه با هاله‌های محو و گرادیان
        "bg-[radial-gradient(1200px_600px_at_110%_-10%,hsl(var(--accent-2)/0.18),transparent),radial-gradient(900px_420px_at_-10%_-20%,hsl(var(--accent-3)/0.16),transparent)]"
      )}
      aria-labelledby="site-footer-title"
    >
      {/* نوار درخشان بالایی */}
      <div className="absolute inset-x-0 -top-px h-[2px] animate-shimmer bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)]" />

      {/* Blobs تزئینی */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-72 w-72 rounded-full bg-ui-fg-muted/10 blur-3xl animate-float" />
      <div className="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-ui-fg-subtle/10 blur-3xl animate-float-delayed" />

      <div className="content-container relative z-[1] w-full">
        {/* بخش برند و پیام */}
        <section className="py-12 md:py-16">
          <h2 id="site-footer-title" className="sr-only">
            {brandName} footer
          </h2>

          <div className="flex flex-col gap-5 sm:gap-6">
            <BrandWordmark name={brandName} />

            <p className="max-w-3xl leading-relaxed text-ui-fg-muted txt-small md:txt-medium">
              فروشگاه اینترنتی {brandName} از سال ۱۳۸۷ با تمرکز بر{" "}
              <strong className="text-ui-fg-base">کیفیت بالا</strong>،{" "}
              <strong className="text-ui-fg-base">قیمت منصفانه</strong> و{" "}
              <strong className="text-ui-fg-base">پشتیبانی حرفه‌ای</strong>{" "}
              همراه خانواده‌های ایرانی است. امروز با اعتماد صدها هزار مشتری در
              سراسر کشور، مجموعه‌ای به‌روز از پوشاک کودک را با تجربه‌ی خریدی
              ساده و لذت‌بخش ارائه می‌کنیم.
            </p>

            {/* آدرس شعب */}
            <div className="glass-card rounded-2xl border border-ui-border-base/60 p-5 md:p-6">
              <h3 className="txt-small-plus text-ui-fg-base mb-3">
                آدرس فروشگاه‌ها (رشت)
              </h3>
              <ul className="space-y-2 txt-small text-ui-fg-subtle">
                <li>
                  <span className="text-ui-fg-base">شعبه ۱:</span> گلسار، بلوار
                  دیلمان، جنب کوچه آذراندامی (روبروی مرکز خرید دیلمان)
                </li>
                <li>
                  <span className="text-ui-fg-base">شعبه ۲:</span> خیابان
                  مطهری، روبروی مسجد بادی‌الله، نبش کوچه ساغری‌سازان
                </li>
                <li>
                  <span className="text-ui-fg-base">شعبه ۳:</span> خیابان
                  مطهری، بازار بزرگ مسگران
                </li>
              </ul>
              <p className="mt-3 txt-compact-small text-ui-fg-muted">
                همه‌روزه (حتی ایام تعطیل) پذیرای شما هستیم 💕🙋‍♂️
              </p>
            </div>

            {/* شبکه‌های اجتماعی */}
            <div className="flex items-center gap-3">
              <SocialIcon label="GitHub" href="https://github.com/medusajs">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.77.6-3.36-1.2-3.36-1.2-.46-1.18-1.12-1.5-1.12-1.5-.92-.62.07-.61.07-.61 1.02.07 1.56 1.06 1.56 1.06.9 1.56 2.37 1.11 2.95.85.09-.65.35-1.1.63-1.35-2.21-.25-4.54-1.11-4.54-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.26.1-2.62 0 0 .84-.27 2.75 1.02.8-.22 1.66-.33 2.51-.33.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.36.2 2.37.1 2.62.64.7 1.03 1.59 1.03 2.68 0 3.83-2.33 4.68-4.55 4.93.36.31.68.92.68 1.86v2.76c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"
                  />
                </svg>
              </SocialIcon>

              <SocialIcon label="Instagram" href="https://instagram.com">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3Zm0 7.7a3 3 0 1 1 0-6.01 3 3 0 0 1 0 6ZM17.8 6.2a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2ZM8 2h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8a6 6 0 0 1 6-6Zm8 2H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4Z"
                  />
                </svg>
              </SocialIcon>
            </div>
          </div>
        </section>

        {/* لینک‌ها */}
        <div className="pb-10 md:pb-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* دسته‌بندی‌ها */}
          <nav aria-label="دسته‌بندی‌ها">
            <span className="txt-small-plus text-ui-fg-base">دسته‌بندی‌ها</span>
            <ul className="mt-3 space-y-2 text-ui-fg-subtle txt-small">
              {topCategories.map((c) => (
                <li key={c.id} className="flex flex-col">
                  <LocalizedClientLink
                    className={clx(
                      "hover:text-ui-fg-base transition-colors underline-from-center",
                      c.children.length > 0 && "txt-small-plus"
                    )}
                    href={`/categories/${c.handle}`}
                  >
                    {c.name}
                  </LocalizedClientLink>
                  {c.children.length > 0 && (
                    <ul className="mt-2 ms-3 space-y-1">
                      {c.children.slice(0, 4).map((child) => (
                        <li key={child.id}>
                          <LocalizedClientLink
                            className="hover:text-ui-fg-base transition-colors underline-from-center"
                            href={`/categories/${child.handle}`}
                          >
                            {child.name}
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* کالکشن‌ها */}
          <nav aria-label="کالکشن‌ها">
            <span className="txt-small-plus text-ui-fg-base">کالکشن‌ها</span>
            <ul
              className={clx(
                "mt-3 grid gap-2 text-ui-fg-subtle txt-small",
                { "grid-cols-2": (topCollections?.length || 0) > 3 }
              )}
            >
              {topCollections.map((c) => (
                <li key={c.id}>
                  <LocalizedClientLink
                    className="hover:text-ui-fg-base transition-colors underline-from-center"
                    href={`/collections/${c.handle}`}
                  >
                    {c.title}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* پشتیبانی */}
          <nav aria-label="پشتیبانی">
            <span className="txt-small-plus text-ui-fg-base">پشتیبانی</span>
            <ul className="mt-3 space-y-2 text-ui-fg-subtle txt-small">
              <li><LocalizedClientLink className="hover:text-ui-fg-base underline-from-center" href="/help/shipping">ارسال و تحویل</LocalizedClientLink></li>
              <li><LocalizedClientLink className="hover:text-ui-fg-base underline-from-center" href="/help/returns">مرجوعی و تعویض</LocalizedClientLink></li>
              <li><LocalizedClientLink className="hover:text-ui-fg-base underline-from-center" href="/account">حساب کاربری</LocalizedClientLink></li>
              <li><LocalizedClientLink className="hover:text-ui-fg-base underline-from-center" href="/help/contact">تماس با ما</LocalizedClientLink></li>
            </ul>
          </nav>

          {/* شرکت */}
          <nav aria-label="شرکت">
            <span className="txt-small-plus text-ui-fg-base">شرکت</span>
            <ul className="mt-3 space-y-2 text-ui-fg-subtle txt-small">
              <li><LocalizedClientLink className="hover:text-ui-fg-base underline-from-center" href="/about">درباره ما</LocalizedClientLink></li>
              <li><LocalizedClientLink className="hover:text-ui-fg-base underline-from-center" href="/blog">وبلاگ</LocalizedClientLink></li>
              <li><a className="hover:text-ui-fg-base underline-from-center" href="https://docs.medusajs.com" target="_blank" rel="noreferrer">مستندات</a></li>
              <li><a className="hover:text-ui-fg-base underline-from-center" href="https://github.com/medusajs/nextjs-starter-medusa" target="_blank" rel="noreferrer">سورس‌کد</a></li>
            </ul>
          </nav>
        </div>

        {/* جداکننده */}
        <div className="h-px w-full bg-ui-border-base/70" />

        {/* نوار پایینی */}
        <div className="py-6 md:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-ui-fg-muted">
          <div className="flex items-center gap-3">
            <Text className="txt-compact-small">
              © {new Date().getFullYear()} {brandName}. همه حقوق محفوظ است.
            </Text>
            <div className="hidden sm:flex items-center gap-3 txt-compact-small">
              <LocalizedClientLink href="/legal/privacy" className="hover:text-ui-fg-base underline-from-center">حریم خصوصی</LocalizedClientLink>
              <span aria-hidden="true">•</span>
              <LocalizedClientLink href="/legal/terms" className="hover:text-ui-fg-base underline-from-center">قوانین</LocalizedClientLink>
            </div>
          </div>

          {/* بَج‌های پرداخت (Placeholder) */}
          <div className="flex items-center gap-3 opacity-85">
            <span className="sr-only">روش‌های پرداخت</span>
            <span className="h-6 w-10 rounded-md bg-ui-border-base/50 shadow-xs" aria-hidden="true" />
            <span className="h-6 w-10 rounded-md bg-ui-border-base/50 shadow-xs" aria-hidden="true" />
            <span className="h-6 w-10 rounded-md bg-ui-border-base/50 shadow-xs" aria-hidden="true" />
          </div>

          <MedusaCTA />
        </div>
      </div>
    </footer>
  )
}
