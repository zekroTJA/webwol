import { useEffect, useState } from "react";
import { APIError } from "../api/errors";
import { Device } from "../api/models";
import { ClientInstance } from "../services/api";
import useAuth from "./useAuth";
import { useSnackbar } from "./useSnackbar";

export default function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const { logout } = useAuth(true);
  const { show } = useSnackbar();

  const wakeUp = (dev: Device) => ClientInstance.wake(dev.uid);

  const refresh = () => {
    setDevices([]);
    return ClientInstance.list()
      .then((dev) => setDevices(dev))
      .catch((err) => {
        if (err instanceof APIError) {
          if (err.code === 401) {
            logout();
          } else {
            show("error", `${err.code}: ${err.message}`);
          }
        }
      });
  };

  useEffect(() => {
    refresh();
  }, []);

  return { devices, wakeUp, refresh };
}
