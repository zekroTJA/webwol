import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { APIError } from "../api/errors";
import { ClientInstance } from "../services/api";
import { useStore } from "../services/store";
import { useSnackbar } from "./useSnackbar";

export default function useAuth(skipInitCheck = false) {
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const setLoggedIn = useStore((s) => s.setLoggedIn);
  const { show } = useSnackbar();
  const nav = useNavigate();

  const init = (key: string, password: string) =>
    ClientInstance.initialize(key, password)
      .then(() => {
        setIsInitialized(true);
        show(
          "success",
          "Successfully initialized. You can now log in using the previously given password."
        );
      })
      .catch((err) => {
        if (err instanceof APIError) {
          if (err.code === 403) {
            show("error", "Invalid initialization key.");
          } else {
            show("error", `${err.code}: ${err.message}`);
          }
        }
      });

  const login = (password: string) =>
    ClientInstance.login(password)
      .then(() => {
        setLoggedIn(true);
        nav("/");
      })
      .catch((err) => {
        if (err instanceof APIError) {
          if (err.code === 401) {
            show("error", "Invalid credentials.");
          }
        }
      });

  const logout = () => {
    setLoggedIn(false);
    ClientInstance.logout();
    nav("/login");
  };

  if (!skipInitCheck) {
    useEffect(() => {
      ClientInstance.isInitialized().then(({ is_initialized }) =>
        setIsInitialized(is_initialized)
      );
    }, []);
  }

  return { isInitialized, init, login, logout };
}
