"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/store/authStore";
import { logout } from "@/lib/api/clientApi";
import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const {
    isAuthenticated,
    user,
    clearIsAuthenticated,
  } = useAuthStore();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // продовжуємо навіть якщо запит не вдався
    } finally {
      clearIsAuthenticated();
      router.push("/sign-in");
    }
  }

  if (isAuthenticated) {
    return (
      <>
        <li
          className={css.navigationItem}
        >
          <Link
            href="/profile"
            prefetch={false}
            className={
              css.navigationLink
            }
          >
            Profile
          </Link>
        </li>

        <li
          className={css.navigationItem}
        >
          <p className={css.userEmail}>
            {user?.email}
          </p>
          <button
            className={css.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li
        className={css.navigationItem}
      >
        <Link
          href="/sign-in"
          prefetch={false}
          className={css.navigationLink}
        >
          Login
        </Link>
      </li>

      <li
        className={css.navigationItem}
      >
        <Link
          href="/sign-up"
          prefetch={false}
          className={css.navigationLink}
        >
          Sign up
        </Link>
      </li>
    </>
  );
}
