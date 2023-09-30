import {AccessRight} from '../Shared/model';

export interface Account {
  username: string;
  password: string;
}

export interface Handler {
  handleRequest(): void;
}

export interface SessionToken {
  tokenId: string;
  username: string;
  valid: boolean;
  expiration_time: Date;
  access_rights: AccessRight[];
}

export enum TokenState {
  VALID,
  INVALID,
  EXPIRED,
}

export interface TokenRights {
  access_rights: AccessRight[];
  state: TokenState;
}

export interface TokenGenerator {
  generateToken(account: Account): Promise<SessionToken | undefined>;
}

export interface TokenValidator {
  validateToken(tokeId: string): Promise<TokenRights>;
}
