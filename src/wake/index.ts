import { EventEmitter } from "node:events";
import { Client, Message, TextBasedChannel } from "discord.js";
import { isNil } from "lodash";
import { Logger } from "pino";
import { replace } from "out-of-character";
import { logChannel } from "src/utils/log-channel";
import { logUser } from "src/utils/log-user";
import { config } from "src/config";

export class WakeReact extends EventEmitter {
  private client: Client;
  private containsKeywords = keywordMatcher(config.keywords);

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
    const content = replace(msg.content);
    return this.containsKeywords(content);
  };

  private async wakeThatGomi(channel: TextBasedChannel, msg: Message) {
    const l = this.logger.child({
      channel: logChannel(channel),
      repliedUser: logUser(msg.author),
      content: msg.content,
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
  return row.split(/(?<!\\),/g).map((r) => r.replace(/\\,/g, ","));
}

function keywordMatcher(row: string): (msg: string) => boolean {
  const keywords = parseCSV(row);
  const substrings: string[] = [];
  const patterns: RegExp[] = [];
  for (const k of keywords) {
    const matchPattern = k.match(/^\/(.+)\/([a-z]*)$/);
    if (!isNil(matchPattern)) {
      try {
        const regex = new RegExp(matchPattern[1], matchPattern[2]);
        patterns.push(regex);
      } catch (err) {
        throw new Error(`invalid keyword ${k}: ${err}`);
      }
      continue;
    }
    substrings.push(k);
  }

  return (msg: string): boolean => {
    return (
      substrings.some((s) => msg.includes(s)) ||
      patterns.some((p) => p.test(msg))
    );
  };
}
