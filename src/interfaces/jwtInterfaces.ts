export interface User {
    find(arg0: (u: any) => boolean);
    id: number;
    name: string;
    email: string;
    password: string
}

export interface Event {
    then(arg0: (users: any) => any);
    find(arg0: (u: any) => boolean);
    name: string;
    description: string;
}

export interface Userxevents {
    filter(arg0: (e: any) => boolean);
    find(arg0: (u: any) => boolean);
    id: number;
    userId: number;
    eventName: string;
}

export interface Session {
    id: number;
    dateCreated: number;
    username: string;
    issued: number;
    expires: number;
}

export type PartialSession = Omit<Session, "issued" | "expires">;

export interface EncodeResult {
    token: string,
    expires: number,
    issued: number
}

export type DecodeResult =
    | {
          type: "valid";
          session: Session;
      }
    | {
          type: "integrity-error";
      }
    | {
          type: "invalid-token";
      };

export type ExpirationStatus = "expired" | "active" | "grace";