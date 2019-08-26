const telegramClient = require('./config/telegram')

class Bot {
  constructor() {
    this.telegramClient = telegramClient
  }

  start() {
    this.telegramClient.launch()
    console.log('bot has started!')
  }
}

module.exports = Bot
