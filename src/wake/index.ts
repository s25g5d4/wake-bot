import { EventEmitter } from "node:events";
import { Client, Message, TextBasedChannel } from "discord.js";
import { isNil } from "lodash";
import { Logger } from "pino";
import { logChannel } from "src/utils/log-channel";
import { logUser } from "src/utils/log-user";
import { config } from "src/config";

export class WakeReact extends EventEmitter {
  private client: Client;
  private keywords = parseCSV(config.keywords);

  constructor(private logger: Logger) {
    super();
  }

  public async init(client: Client) {
    this.client = client;
    const channels = parseCSV(config.channels);
    await Promise.all(channels.map((ch) => this.listenMessages(ch)));
  }

  private async listenMessages(channelId: string) {
    const channel = await this.client.channels.fetch(channelId);
    if (isNil(channel)) {
      throw new Error("channel is null");
    }

    if (!channel.isTextBased()) {
      throw new Error("not a text-based channel");
    }

    const collector = channel.createMessageCollector({ filter: this.filter });
    collector.on("collect", (msg) => {
      this.wakeThatGomi(channel, msg);
    });

    collector.on("end", () => {
      this.emit("error", new Error("unexpected collector end"));
    });
  }

  private filter = (msg: Message): boolean => {
    return this.keywords.some((keyword) => msg.content.includes(keyword));
  };

  private async wakeThatGomi(channel: TextBasedChannel, msg: Message) {
    const l = this.logger.child({
      channel: logChannel(channel),
      repliedUser: logUser(msg.author),
    });

    try {
      await msg.reply({
        content: config.replyContent,
        allowedMentions: { repliedUser: false },
      });
    } catch (err) {
      l.error({ err }, "failed to send wake");
    }

    l.info("wake up sent");
  }
}

function parseCSV(row: string): string[] {
  return row.split(",");
}
