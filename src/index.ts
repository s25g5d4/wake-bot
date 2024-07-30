import { config } from "./config";
import { logger } from "./logger";
import { Server } from "./server";

async function main() {
  logger.debug(`starting ${config.app}`);

  const server = new Server();
  await server.init();

  logger.info(`${config.app} started`);
}

main();
