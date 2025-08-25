import { Telegraf } from 'telegraf';

const token = process.env.TELEGRAM_BOT_TOKEN || 'TEST_TOKEN';
const isPlaceholder = token === 'TEST_TOKEN' || token.startsWith('replace');
const bot = new Telegraf(token);

bot.start((ctx) => ctx.reply('AM CRM Bot online'));

if (import.meta.main) {
  if (isPlaceholder) {
    console.log('Skipping bot launch: TELEGRAM_BOT_TOKEN not set');
  } else {
    bot.launch();
    console.log('Telegram bot started');
  }
}
