import { useEditUserProfileModalStore } from "@/stores/use-modal-store";

const useEditUserProfileModal = () => {
  const { isOpen, setIsOpen, onOpen, onClose } = useEditUserProfileModalStore();

  return {
    isOpen,
    setIsOpen,
    onOpen,
    onClose
  };
};

export default useEditUserProfileModal;
