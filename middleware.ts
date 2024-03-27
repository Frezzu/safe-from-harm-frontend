import { withAuth } from "next-auth/middleware"

export default withAuth({
  // Matches the pages config in `[...nextauth]/route.ts`
  pages: {
    signIn: '/login',
    error: '/error',
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)']
}
