import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(
  request: NextRequest
) {
  const { pathname } =
    request.nextUrl;


  const session =
    request.cookies.get(
      "combine_session"
    );



  // Protect admin routes
  if (
    pathname.startsWith("/admin")
  ) {

    // Allow middleware to handle redirect
    // if no session exists
    if (!session) {

      return NextResponse.redirect(
        new URL(
          "/login",
          request.url
        )
      );

    }

  }


  return NextResponse.next();
}



export const config = {
  matcher: [
    "/admin/:path*",
  ],
};