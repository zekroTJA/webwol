import { useEffect, useState } from "react";
import { Device } from "../api/models";
import { ClientInstance } from "../services/api";

export default function usePing(device: Device) {
  const [state, setState] = useState<boolean | null>(null);

  const refresh = (delay = 0) => {
    if (device.ip_address) {
      setState(null);
      setTimeout(
        () =>
          ClientInstance.ping(device.uid).then(({ successful }) =>
            setState(successful)
          ),
        delay
      );
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { state, refresh };
}
