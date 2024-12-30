import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SavePropertyState {
  savedProperties: Record<string, boolean>;
  toggleSavedProperty: (propertyId: string) => void;
  setSavedProperty: (propertyId: string, isSaved: boolean) => void;
}

export const useSavePropertyStore = create(
  persist<SavePropertyState>(
    (set) => ({
      savedProperties: {},
      toggleSavedProperty: (propertyId: string) =>
        set((state) => {
          const newSavedProperties = {
            ...state.savedProperties,
            [propertyId]: !state.savedProperties[propertyId]
          };
          return { savedProperties: newSavedProperties };
        }),
      setSavedProperty: (propertyId: string, isSaved: boolean) =>
        set((state) => {
          const newSavedProperties = {
            ...state.savedProperties,
            [propertyId]: isSaved
          };
          return { savedProperties: newSavedProperties };
        })
    }),
    {
      name: "saved-properties"
    }
  )
);
