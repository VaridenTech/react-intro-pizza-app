// basically stolen from the React docs
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  children: ReactNode;
};

const Modal = ({ children }: ModalProps) => {
  const elRef = useRef<HTMLDivElement | null>(null);
  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    const modalRoot = document.getElementById("modal");
    // เก็บ .current ไว้ใน const ก่อน ไม่งั้น cleanup อาจลบ element ผิดตัว
    const el = elRef.current;
    if (!modalRoot || !el) return;

    modalRoot.appendChild(el);
    return () => {
      modalRoot.removeChild(el);
    };
  }, []);

  return createPortal(<div>{children}</div>, elRef.current);
};

export default Modal;
