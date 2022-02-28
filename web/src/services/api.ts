import { Client } from "../api/api";

const APIENDPOINT = (import.meta.env.VITE_APIENDPOINT ?? "") + "/api";

export const ClientInstance = new Client(APIENDPOINT);
