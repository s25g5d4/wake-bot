import { BaseChannel, ChannelType, TextBasedChannel } from "discord.js";
import { isNil } from "lodash";
import { logUser, LogUserObject } from "./log-user";

interface LogChannelObject {
  id: string;
  type: string;
  name?: string;
  recipient?: LogUserObject;
  parent?: LogChannelObject;
}

function logBaseChannel(
  channel: Pick<BaseChannel, "id" | "type">,
): LogChannelObject {
  const { id, type } = channel;
  return { id, type: ChannelType[type] };
}

export function logChannel(channel: TextBasedChannel): LogChannelObject {
  if (isNil(channel)) {
    return undefined;
  }

  if (channel.type === ChannelType.DM) {
    const { recipient } = channel;
    return { ...logBaseChannel(channel), recipient: logUser(recipient) };
  }

  if (channel.isThread()) {
    const { name, parent } = channel;
    if (parent.isTextBased()) {
      return { ...logBaseChannel(channel), name, parent: logChannel(parent) };
    } else {
      return {
        ...logBaseChannel(channel),
        name,
        parent: logBaseChannel(parent),
      };
    }
  }

  const { name } = channel;
  return { ...logBaseChannel(channel), name };
}
