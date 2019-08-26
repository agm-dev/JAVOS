const Telegraf = require('telegraf')
const { telegramApiToken } = require('./vars')
const {
  getFuelPriceHandler,
} = require('../controllers/telegram.controller')

const client = new Telegraf(telegramApiToken)

client.command('diesel', getFuelPriceHandler)

module.exports = client
