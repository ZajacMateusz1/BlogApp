import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
interface ModalWrapperProps {
  children: ReactNode;
  isOpen: boolean;
  handleCloseModal: () => void;
}
export default function ModalWrapper({
  children,
  isOpen,
  handleCloseModal,
}: ModalWrapperProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCloseModal]);
  return createPortal(
    <div
      className={`absolute ${isOpen ? "top-0 left-0 right-0 bottom-0 bg-black opacity-50" : ""}`}
    >
      <div className="absolute top-1/2 left-1/2 -translate-1/2 text-center">
        {children}
        <Button onClick={handleCloseModal}>Close Modal</Button>
      </div>
    </div>,
    document.getElementById("modal-root")!,
  );
}
