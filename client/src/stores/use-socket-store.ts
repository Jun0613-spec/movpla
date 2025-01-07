import { create } from "zustand";
import { io, Socket } from "socket.io-client";

import { useAuthStore } from "./use-auth-store";

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  initSocket: () => void;
  disconnectSocket: () => void;
  emitNewUser: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,

  initSocket: () => {
    if (get().socket) return;

    const socket = io(process.env.NEXT_PUBLIC_SERVER_URL!, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on("connect", () => {
      set({ isConnected: true });
      get().emitNewUser();
    });

    socket.on("disconnect", () => set({ isConnected: false }));

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  emitNewUser: () => {
    const { socket } = get();
    const user = useAuthStore.getState().user;

    if (socket && user) {
      socket.emit("newUser", user.id);
    }
  }
}));
