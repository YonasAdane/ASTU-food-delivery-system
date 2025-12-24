import { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the UserStore interface
interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

// Create the store with persistence
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
    }
  )
);
