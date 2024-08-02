//@ts-nocheck
import { UserType } from "@/types/user";
import { StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

export interface AuthSlice {
  userInfo: undefined | UserType;
  setUserInfo: (userInfo: UserType) => void;
  logOut: () => void;
}

// Adjust the type of StateCreator to include the persist middleware
type AuthSliceCreator = StateCreator<
  AuthSlice,
  [["zustand/persist", AuthSlice]]
>;

export const createAuthSlice: AuthSliceCreator = persist(
  (set) => ({
    userInfo: undefined,
    setUserInfo: (userInfo: UserType) => set({ userInfo }),
    logOut: () => set({ userInfo: undefined }),
  }),
  {
    name: "user-storage", // The name of the local storage key
    getStorage: () => localStorage, // Use localStorage for persistence
  }
);
