"use client";

import {
  useEffect,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({
  onClose,
  children,
}: ModalProps) {
  useEffect(() => {
    function handleKeyDown(
      e: KeyboardEvent,
    ) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener(
      "keydown",
      handleKeyDown,
    );
    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      className={css.overlay}
      onClick={onClose}
    >
      <div
        className={css.modal}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
