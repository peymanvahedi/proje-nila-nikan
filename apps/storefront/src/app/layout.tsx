// src/app/layout.tsx
import { getBaseURL } from "@lib/util/env"
import type { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <main className="relative">{children}</main>
      </body>
    </html>
  )
}
