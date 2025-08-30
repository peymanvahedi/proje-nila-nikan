import { NextRequest, NextResponse } from "next/server"

const COUNTRY_CODE = "ir"

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const path = url.pathname

  // استثناء برای مسیر /admin/stories
  if (path.startsWith("/admin/stories")) {
    return NextResponse.next() // اجازه می‌دهد این مسیر بدون تغییر بماند
  }

  // مسیرهای سیستمی/استاتیک را دست‌نزن
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path === "/favicon.ico" ||
    /\.(png|svg|jpg|jpeg|gif|webp|ico|txt|xml|map)$/.test(path)
  ) {
    return NextResponse.next()
  }

  // اگر خودش /ir است، ادامه بده
  if (path.startsWith(`/${COUNTRY_CODE}`)) {
    return NextResponse.next()
  }

  // ری‌رایت داخلی به /ir... (URL کاربر همون /store می‌مونه)
  url.pathname = `/${COUNTRY_CODE}${path === "/" ? "" : path}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ["/((?!_next|api|.*\\.(?:png|svg|jpg|jpeg|gif|webp|ico|txt|xml|map)).*)"],
}
