import {
  NextRequest,
  NextResponse,
} from "next/server";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = [
  "/notes",
  "/profile",
];
const publicRoutes = [
  "/sign-in",
  "/sign-up",
];

export async function middleware(
  request: NextRequest,
) {
  const { pathname } = request.nextUrl;

  const isPrivate = privateRoutes.some(
    (route) =>
      pathname.startsWith(route),
  );
  const isPublic = publicRoutes.some(
    (route) =>
      pathname.startsWith(route),
  );

  if (!isPrivate && !isPublic) {
    return NextResponse.next();
  }

  const cookieHeader =
    request.headers.get("cookie") ?? "";
  const session = await checkSession(
    cookieHeader,
  );
  const isAuthenticated = !!session;

  if (isPrivate && !isAuthenticated) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url),
    );
  }

  if (isPublic && isAuthenticated) {
    return NextResponse.redirect(
      new URL("/profile", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/notes/:path*",
    "/profile/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
