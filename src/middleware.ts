import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let res = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          res = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/dashboard', '/professeurs', '/interactions', '/upload'];
  const isProtected = protectedPaths.some(p => pathname.startsWith(p));

  if (!user && isProtected)
    return NextResponse.redirect(new URL('/login', request.url));
  if (user && pathname === '/login')
    return NextResponse.redirect(new URL('/dashboard', request.url));

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
