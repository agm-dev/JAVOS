const { getFuelPrices } = require('../services/fuel-price-informer')

async function getFuelPriceHandler(ctx) {
  const {
    entities,
    text,
  } = ctx.message

  const commandEntity = entities.find(entity => entity.type === 'bot_command')
  let id = null
  if (commandEntity.length < text.length) {
    id = text.slice(7).trim()
  }

  const stations = await getFuelPrices(id)
  const message = stations.reduce((result, station) => {
    const row = `ID: ${station.id}\nPrecio: ${station.price} € el litro\nNombre: ${station.name}\nDirección: ${station.address.toLowerCase()}, (${station.city.trim()})\n`
    return `${result}${row}\n`
  }, 'Precios gasolineras en Rivas para diesel A\n\n')

  ctx.reply(message)
}

module.exports = {
  getFuelPriceHandler,
}
