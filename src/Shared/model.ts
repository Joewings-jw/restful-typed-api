import {Account} from '../Server/Model';

export enum AccessRight {
  CREATE,
  READ,
  UPDATE,
  DELETE,
}
export interface UserCredentials extends Account {
  access_rights: AccessRight[];
}

export enum HTTP_CODES {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum HTTP_METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface User {
  id?: string;
  name: string;
  age: number;
  email: string;
  working_position: WorkingPosition;
}

export enum WorkingPosition {
  JUNIOR,
  PROGRAMMER,
  ENGINEER,
  MANAGER,
  EXPERT,
}

export interface UserResponseDTO {
  id?: string;
  email: string;
  working_position: number;
}
