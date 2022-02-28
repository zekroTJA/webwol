import create from "zustand";
import { SnackbarState } from "../hooks/useSnackbar";

export type State = {
  snackBar: SnackbarState;
  setSnackBar: (snackBar: SnackbarState) => void;
};

export const useStore = create<State>((set) => ({
  snackBar: { show: false },
  setSnackBar: (snackBar) => set({ snackBar }),
}));
