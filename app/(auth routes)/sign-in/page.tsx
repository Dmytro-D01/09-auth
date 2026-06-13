"use client";

import {
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/clientApi";
import useAuthStore from "@/lib/store/authStore";
import css from "./SignInPage.module.css";

export default function SignInPage() {
  const [error, setError] =
    useState<string>("");
  const router = useRouter();
  const { setUser } = useAuthStore();

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");

    const formData = new FormData(
      event.currentTarget,
    );
    const email = formData.get(
      "email",
    ) as string;
    const password = formData.get(
      "password",
    ) as string;

    try {
      const user = await login({
        email,
        password,
      });
      setUser(user);
      router.push("/profile");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Login failed. Please check your credentials.",
        );
      }
    }
  }

  return (
    <main className={css.mainContent}>
      <form
        className={css.form}
        onSubmit={handleSubmit}
      >
        <h1 className={css.formTitle}>
          Sign in
        </h1>

        <div className={css.formGroup}>
          <label htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
          >
            Log in
          </button>
        </div>

        {error && (
          <p className={css.error}>
            {error}
          </p>
        )}
      </form>
    </main>
  );
}
