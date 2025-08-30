export const withBaseUrl = (url?: string) => {
  if (!url) return ""
  if (url.startsWith("http")) return url
  return `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || ""}${url}`
}
