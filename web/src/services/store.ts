import create from "zustand";
import { SnackbarState } from "../hooks/useSnackbar";

export type State = {
  snackBar: SnackbarState;
  setSnackBar: (snackBar: SnackbarState) => void;

  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
};

export const useStore = create<State>((set) => ({
  snackBar: { show: false },
  setSnackBar: (snackBar) => set({ snackBar }),

  loggedIn: false,
  setLoggedIn: (loggedIn) => set({ loggedIn }),
}));
