import { User } from "discord.js";
import { isNil } from "lodash";

export interface LogUserObject {
  id: string;
  username: string;
}

function logSingleUser(user: User): LogUserObject {
  if (isNil(user)) {
    return undefined;
  }

  const { id, username } = user;
  return { id, username };
}

export function logUser(user: User): LogUserObject;
export function logUser(users: User[]): LogUserObject[];
export function logUser(user: User | User[]): LogUserObject | LogUserObject[] {
  if (Array.isArray(user)) {
    return user.map((u) => logSingleUser(u));
  }
  return logSingleUser(user);
}
