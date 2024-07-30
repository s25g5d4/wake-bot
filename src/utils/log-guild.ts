import { Guild } from "discord.js";
import { isNil } from "lodash";

export function logGuild(guild: Guild) {
  if (isNil(guild)) {
    return undefined;
  }

  const { id, name } = guild;
  return { id, name };
}
