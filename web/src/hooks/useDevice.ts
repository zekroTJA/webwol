import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { APIError } from "../api/errors";
import { Device } from "../api/models";
import { ClientInstance } from "../services/api";
import { useSnackbar } from "./useSnackbar";

export default function useDevice(uid: string) {
  const [device, setDevice] = useState({ uid } as Device);
  const { show } = useSnackbar();
  const nav = useNavigate();

  const _isNew = uid === "new";

  const update = (dev: Partial<Device>) => {
    setDevice({ ...Object.assign(device, dev) });
  };

  const commit = () => {
    const action = _isNew ? ClientInstance.create : ClientInstance.update;
    action
      .call(ClientInstance, device!)
      .then(() => {
        nav("/");
        show("success", `Device has been ${_isNew ? "created" : "updated"}.`);
      })
      .catch((err) => {
        if (err instanceof APIError) {
          show("error", `${err.code}: ${err.message}`);
        }
      });
  };

  const remove = () => {
    ClientInstance.delete(device.uid)
      .then(() => {
        nav("/");
        show("success", "Device has been removed.");
      })
      .catch((err) => {
        if (err instanceof APIError) {
          show("error", `${err.code}: ${err.message}`);
        }
      });
  };

  useEffect(() => {
    if (_isNew) return;

    ClientInstance.get(uid)
      .then((res) => setDevice(res))
      .catch((err) => {
        if (err instanceof APIError) {
          if (err.code === 401) {
            nav("/login");
          } else if (err.code === 404) {
            show("error", "Device not found.");
          } else {
            show("error", `${err.code}: ${err.message}`);
          }
        }
      });
  }, []);

  return { device, update, commit, remove };
}
