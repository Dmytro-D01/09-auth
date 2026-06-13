"use client";

import Image from "next/image";
import {
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/store/authStore";
import { updateMe } from "@/lib/api/clientApi";
import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } =
    useAuthStore();
  const [username, setUsername] =
    useState<string>(
      user?.username ?? "",
    );

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      const updatedUser =
        await updateMe({ username });
      setUser(updatedUser);
      router.push("/profile");
    } catch (err) {
      console.error(
        "Failed to update profile:",
        err,
      );
    }
  }

  function handleCancel() {
    router.push("/profile");
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>
          Edit Profile
        </h1>

        {user?.avatar && (
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        )}

        <form
          className={css.profileInfo}
          onSubmit={handleSubmit}
        >
          <div
            className={
              css.usernameWrapper
            }
          >
            <label htmlFor="username">
              Username:
            </label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value,
                )
              }
            />
          </div>

          <p>Email: {user?.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
            >
              Save
            </button>
            <button
              type="button"
              className={
                css.cancelButton
              }
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
