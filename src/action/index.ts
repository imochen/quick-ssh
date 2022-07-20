export interface User {
  username: string;
  password: string;
}

export interface Host {
  hostname: string;
  port: number;
  user: string;
}

export interface Config {
  user: Record<string, User>;
  host: Record<string, Host>;
}
