import { StateCreator } from "..";

export interface LayoutSlice {
  showBalance: boolean;
  setShowBalance: (showBalance: boolean) => void;
}

const createLayoutSlice: StateCreator<LayoutSlice> = (set, get) => ({
  showBalance: true,
  setShowBalance: (showBalance) => {
    set({ showBalance });
  },
});

export default createLayoutSlice;
