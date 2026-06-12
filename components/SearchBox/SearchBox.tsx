"use client";

import {
  useEffect,
  useRef,
} from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onSearch: (query: string) => void;
}

export default function SearchBox({
  value,
  onSearch,
}: SearchBoxProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    if (timerRef.current)
      clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      () => {
        onSearch(e.target.value);
      },
      500,
    );
  }

  useEffect(() => {
    return () => {
      if (timerRef.current)
        clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <input
      ref={inputRef}
      className={css.input}
      type="text"
      placeholder="Search notes..."
      defaultValue={value}
      onChange={handleChange}
    />
  );
}
