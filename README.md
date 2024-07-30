# Wake Bot

當你做夢時打醒你的垃圾 bot。

## Prerequisite

- Node.js 20
- A Discord application and bot
  - Scopes: `bot`, `applications.commands`
  - Bot permissions: `Send Messages`, `Send Messages in Threads`

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Build sources:

   ```
   npm run build
   ```

3. Setup environment variables. See Environment Variables section below for
   more details.

4. Start the app:
   ```
   npm run start
   ```

## Environment Variables

- `DISCORD_BOT_TOKEN`: The bot token. You can get it in the bot settings page.
- `DISCORD_CLIENT_ID`: Your Discord application id.
- `LOG_LEVEL`: Application log level.
- `CHANNELS`: Comma-separated channel ids.
- `KEYWORDS`: Comma-separated keywords to respond to.
- `REPLY_CONTENT`: Reply content.

Wake Bot uses [dotenv](https://www.npmjs.com/package/dotenv) to load
env variables from `.env` file. You can edit the `.env.example` and rename it to
`.env` to enable env variables.
