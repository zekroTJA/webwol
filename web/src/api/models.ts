export interface ErrorReponse {
  error: string;
  code: number;
  context: string;
}

export interface Status {
  code: number;
  message: string;
}

export interface LoginRequest {
  password: string;
}

export interface TokenResponse {
  token: string;
  expires: string;
}

export interface InitializedResponse {
  is_initialized: boolean;
}

export interface InitializationRequest extends LoginRequest {
  key: string;
}

export interface PingResponse {
  successful: boolean;
  rtt: number;
}

export enum DeviceType {
  UNSPECIFIED,
  PC,
  SERVER,
  IOT,
  MOBILE,
}

export interface Device {
  uid: string;
  name: string;
  type: DeviceType;
  mac_address: string;
  ip_address: string;
}
