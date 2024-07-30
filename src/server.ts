import { Client, GatewayIntentBits } from "discord.js";
import { logger } from "./logger";
import { config } from "./config";
import { WakeReact } from "./wake";

export class Server {
  constructor() {}

  init(): Promise<void> {
    return new Promise((ok) => {
      const client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
        ],
      });

      const wake = new WakeReact(logger.child({ component: "WakeReact" }));

      client.once("ready", (client) => {
        logger.info("connected to discord");
        wake.init(client).then(() => ok());
      });

      wake.on("error", (err) => {
        throw err;
      });

      client.on("error", (err) => {
        throw err;
      });

      logger.debug("connecting to discord");
      client.login(config.token);
    });
  }
}
