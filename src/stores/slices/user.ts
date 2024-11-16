import { User } from "@/api/types";
import { StateCreator } from "..";
import { clearAccessToken, setAccessToken } from "@/utils";

export interface UserSlice {
  user?: User;
  saveUser: (
    details: { access_token: string; refresh_token: string } & User
  ) => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  clearUser: () => Promise<void>;
  expoPushToken?: string;
  setExpoPushToken: (token: string) => void;
}

const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  async saveUser({ access_token, refresh_token: _, ...user }) {
    try {
      // Set the auth token
      await setAccessToken(access_token);
      // Update the user in the local state
      set({ user });
    } catch (error) {
      // Log the error and handle it appropriately
      console.error("Error saving user:", error);
      throw error;
    }
  },
  updateUser: (user) => {
    const oldUser = get().user;
    if (!oldUser) {
      console.error("User not found");
      return;
    }

    const newUser = { ...oldUser, ...user };
    set((s) => ({ user: newUser }));
  },
  clearUser: async () => {
    set({ user: undefined });
    await clearAccessToken();
  },
  setExpoPushToken: (token: string) => {
    set({
      expoPushToken: token,
    });
  },
});

export default createUserSlice;
