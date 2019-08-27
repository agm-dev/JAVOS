const Telegraf = require('telegraf')
const { telegramApiToken } = require('./vars')
const {
  errorHandler,
  getFuelPriceHandler,
  getYelmoInfoHandler,
} = require('../controllers/telegram.controller')

const client = new Telegraf(telegramApiToken)

client.command('diesel', errorHandler(getFuelPriceHandler))
client.command('cartelera', errorHandler(getYelmoInfoHandler))

module.exports = client
