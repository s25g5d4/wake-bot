import "dotenv/config";

export const config = {
  token: process.env.DISCORD_BOT_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  app: process.env.APP_NAME ?? "Wake-bot",
  logLevel: process.env.LOG_LEVEL ?? "info",
  channels: process.env.CHANNELS,
  keywords: process.env.KEYWORDS ?? "我婆",
  replyContent: process.env.REPLY_CONTENT ?? "醒",
};
