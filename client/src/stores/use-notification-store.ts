import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface NotificationState {
  number: number;
  fetch: () => Promise<void>;
  decrease: () => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  number: 0,
  fetch: async () => {
    try {
      const res = await axiosInstance("/api/chats/unread/count");

      set({ number: res.data });
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  },
  decrease: () => {
    set((prev) => ({ number: prev.number - 1 }));
  },
  reset: () => {
    set({ number: 0 });
  }
}));
