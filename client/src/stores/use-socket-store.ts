import { create } from "zustand";
import { io, Socket } from "socket.io-client";

import { useAuthStore } from "./use-auth-store";

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  initSocket: () => void;
  connectSocket: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,

  initSocket: () => {
    const socket = io(process.env.NEXT_PUBLIC_SERVER_URL!, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on("connect", () => set({ isConnected: true }));
    socket.on("disconnect", () => set({ isConnected: false }));

    set({ socket });
  },

  connectSocket: () => {
    const { socket } = get();
    const user = useAuthStore.getState().user;

    if (user && socket) {
      socket.emit("newUser", user.id);
    }
  }
}));
