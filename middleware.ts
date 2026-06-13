import {
  NextRequest,
  NextResponse,
} from "next/server";

const privateRoutes = [
  "/notes",
  "/profile",
];
const publicRoutes = [
  "/sign-in",
  "/sign-up",
];

function isAuthenticated(
  request: NextRequest,
): boolean {
  const accessToken =
    request.cookies.get(
      "accessToken",
    )?.value;
  const refreshToken =
    request.cookies.get(
      "refreshToken",
    )?.value;
  return !!(
    accessToken || refreshToken
  );
}

export function middleware(
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

  const authenticated =
    isAuthenticated(request);

  if (isPrivate && !authenticated) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url),
    );
  }

  if (isPublic && authenticated) {
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
