import { APIError } from "./errors";
import {
  Device,
  ErrorReponse,
  InitializedResponse,
  PingResponse,
  Status,
  TokenResponse,
} from "./models";

type HttpMethod = "GET" | "POST" | "DELETE" | "PUT";

export class Client {
  private token: string | undefined;
  private _onUnauthorized: ((err: APIError) => boolean) | undefined;

  constructor(private baseUrl: string = "/api") {}

  // --- AUTH ---

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  set onUnauthorized(handler: (err: APIError) => boolean) {
    this._onUnauthorized = handler;
  }

  isInitialized(): Promise<InitializedResponse> {
    return this.req("GET", "auth/isinitialized");
  }

  initialize(key: string, password: string): Promise<InitializedResponse> {
    return this.req("POST", "auth/initialize", { key, password });
  }

  async login(password: string): Promise<{}> {
    const res = (await this.req("POST", "auth/login", {
      password,
    })) as TokenResponse;
    this.token = `bearer ${res.token}`;
    return {};
  }

  // --- DEVICES ---

  list(): Promise<Device[]> {
    return this.req("GET", "devices");
  }

  get(id: string): Promise<Device> {
    return this.req("GET", `devices/${id}`);
  }

  create(dev: Device): Promise<Device> {
    return this.req("POST", "devices", dev);
  }

  update(dev: Device): Promise<Device> {
    return this.req("POST", `devices/${dev.uid}`, dev);
  }

  delete(id: string): Promise<Status> {
    return this.req("DELETE", `devices/${id}`);
  }

  wake(id: string): Promise<Status> {
    return this.req("POST", `devices/${id}/wake`);
  }

  ping(id: string): Promise<PingResponse> {
    return this.req("POST", `devices/${id}/ping`);
  }

  // --- UTIL ---

  private async req<T>(
    method: HttpMethod,
    path: string,
    body?: object
  ): Promise<T> {
    const headers: { [key: string]: string } = {
      "content-type": "application/json",
    };

    if (!!this.token) headers["authorization"] = this.token;

    path = path.replace("//", "/");

    const res = await window.fetch(`${this.baseUrl}/${path}`, {
      method,
      headers,
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 204) {
      return {} as T;
    }

    let data = {};

    try {
      data = await res.json();
    } catch {}

    if (!res.ok) {
      const err = new APIError(res, data as ErrorReponse);
      if (res.status === 401)
        if (this._onUnauthorized?.call(this, err) === false) return {} as T;
      throw err;
    }

    return data as T;
  }
}
