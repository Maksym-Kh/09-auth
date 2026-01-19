import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!accessToken && refreshToken) {
    try {
      const sessionData = await checkSession();

      const response = isPublicRoute
        ? NextResponse.redirect(new URL('/profile', request.url))
        : NextResponse.next();

      const setCookieHeader = sessionData.headers['set-cookie'];
      if (setCookieHeader) {
        const cookiesArray = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];

        cookiesArray.forEach(cookie =>
          response.headers.append('Set-Cookie', cookie)
        );
      }

      return response;
    } catch (error) {
      const response = NextResponse.redirect(new URL('/sign-in', request.url));
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }
  }

  if (isPrivateRoute) {
    //  ПЕРЕВІРКА ПРИВАТНИХ РОУТІВ
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  //  ПЕРЕВІРКА ПУБЛІЧНИХ РОУТІВ (щоб залогінених не пускало на SignUp)
  if (isPublicRoute && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ['/profile/:path*', '/sign-in', '/sign-up', '/notes/:path*'],
};
