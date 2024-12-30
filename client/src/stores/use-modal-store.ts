import { create } from "zustand";

interface useModalStoreState {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onOpen: () => void;
  onClose: () => void;
}

const createUseModalStore = () =>
  create<useModalStoreState>((set) => ({
    isOpen: false,
    setIsOpen: (value) => set({ isOpen: value }),
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
  }));

export const useEditUserProfileModalStore = createUseModalStore();
