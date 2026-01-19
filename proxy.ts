import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
// import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  // 1. ПЕРЕВІРКА ПРИВАТНИХ РОУТІВ
  if (isPrivateRoute) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    // Просто пропускаємо, якщо є токен.
    // Не треба викликати checkSession тут!
    return NextResponse.next();
  }

  // 2. ПЕРЕВІРКА ПУБЛІЧНИХ РОУТІВ (щоб залогінених не пускало на SignUp)
  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ['/profile/:path*', '/sign-in', '/sign-up', '/notes/:path*'],
};
