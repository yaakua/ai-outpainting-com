import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_LOCALE, locales } from '@/framework/locale/locale'
import authConfig from '@/config/auth-config'

import NextAuth from 'next-auth'

const ADMIN_INCLUDE_PATHS = ['/admin', '/plan-admin']

function isIncludes(originUrl: string) {
  return ADMIN_INCLUDE_PATHS.some((it) => originUrl.includes(it))
}
const { auth } = NextAuth(authConfig)
export default auth(async function middleware(request: NextRequest) {
  // Your custom middleware logic goes here
  console.info('Middleware called', { url: request.url, method: request.method })
  //  自动跳转到对应的语言页面
  const nextUrl = (request as unknown as NextRequest).nextUrl
  const pathname = nextUrl.pathname
  const params = nextUrl.searchParams
  const pathnameIsMissingLocale = locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )
  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(
        `/${DEFAULT_LOCALE}/${pathname}?${params.toString()}`,
        request.url
      )
    )
  }
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ]
}
