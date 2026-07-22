import { useState } from "react";
const useModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);
  return {
    isOpen,
    handleOpenModal,
    handleCloseModal,
  };
};

export default useModal;
