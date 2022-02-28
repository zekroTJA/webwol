import { useRef } from "react";
import { useStore } from "../services/store";

export type SnackbarType = "error" | "success" | "info" | "warning";

export type SnackbarState = {
  show: boolean;
  type?: SnackbarType;
  payload?: string | JSX.Element;
};

export function useSnackbar() {
  const setSnackBar = useStore((s) => s.setSnackBar);

  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const hide = () => setSnackBar({ show: false });

  const show = (
    type: SnackbarType,
    payload: string | JSX.Element,
    timeout: number = 5000
  ) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSnackBar({ show: true, type, payload });
    timerRef.current = setTimeout(() => hide(), timeout);
  };

  return { show, hide };
}
