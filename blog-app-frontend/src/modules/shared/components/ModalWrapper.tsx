import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";
import ErrorBlock from "./ErrorBlock";
interface ModalWrapperProps {
  children: ReactNode;
  handleCloseModal: () => void;
  isLoading?: boolean;
  error?: string;
}
export default function ModalWrapper({
  children,
  handleCloseModal,
  isLoading,
  error,
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
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50"></div>
      <div className="fixed top-1/2 left-1/2 -translate-1/2 flex flex-col items-center gap-1 md:gap-2 lg:gap-4 w-full max-w-lg bg-light rounded-xl p-2 md:p-4 lg:p-6">
        {isLoading && <LoadingSpinner fullScreen={false} />}
        {error && <ErrorBlock>{error}</ErrorBlock>}
        {!isLoading && !error && children}
        {!isLoading && <Button onClick={handleCloseModal}>Close Modal</Button>}
      </div>
    </>,
    document.getElementById("modal-root")!,
  );
}
