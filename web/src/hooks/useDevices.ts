import { useEffect, useState } from "react";
import { useNavigate, useRoutes } from "react-router";
import { APIError } from "../api/errors";
import { Device } from "../api/models";
import { ClientInstance } from "../services/api";
import { useSnackbar } from "./useSnackbar";

export default function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const { show } = useSnackbar();
  const nav = useNavigate();

  const wakeUp = (dev: Device) => ClientInstance.wake(dev.uid);

  useEffect(() => {
    ClientInstance.list()
      .then((dev) => setDevices(dev))
      .catch((err) => {
        if (err instanceof APIError) {
          if (err.code === 401) {
            nav("/login");
          } else {
            show("error", `${err.code}: ${err.message}`);
          }
        }
      });
  }, []);

  return { devices, wakeUp };
}
