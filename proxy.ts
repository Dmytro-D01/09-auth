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

export async function proxy(
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

  const accessToken =
    request.cookies.get(
      "accessToken",
    )?.value;
  const refreshToken =
    request.cookies.get(
      "refreshToken",
    )?.value;

  // accessToken є — авторизований
  if (accessToken) {
    if (isPublic) {
      return NextResponse.redirect(
        new URL(
          "/profile",
          request.url,
        ),
      );
    }
    return NextResponse.next();
  }

  // Є тільки refreshToken — пробуємо оновити сесію
  if (refreshToken) {
    try {
      const cookieHeader =
        request.headers.get("cookie") ??
        "";
      const sessionResponse =
        await checkSession(
          cookieHeader,
        );
      const setCookieHeader =
        sessionResponse.headers[
          "set-cookie"
        ];

      const response = isPublic
        ? NextResponse.redirect(
            new URL(
              "/profile",
              request.url,
            ),
          )
        : NextResponse.next();

      // Якщо отримали нові токени — встановлюємо їх у cookies
      if (setCookieHeader) {
        const cookieArray =
          Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];
        cookieArray.forEach(
          (cookie) => {
            response.headers.append(
              "set-cookie",
              cookie,
            );
          },
        );
      }

      return response;
    } catch {
      // Оновлення сесії не вдалось — не авторизований
    }
  }

  // Не авторизований
  if (isPrivate) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/notes(.*)",
    "/profile(.*)",
    "/sign-in",
    "/sign-up",
  ],
};
