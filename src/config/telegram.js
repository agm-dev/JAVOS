const Telegraf = require('telegraf')
const { telegramApiToken } = require('./vars')
const {
  errorHandler,
  getFuelPriceHandler,
} = require('../controllers/telegram.controller')

const client = new Telegraf(telegramApiToken)

client.command('diesel', errorHandler(getFuelPriceHandler))

module.exports = client
