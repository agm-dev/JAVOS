const { getFuelPrices } = require('../services/fuel-price-informer')
const { getYelmoInfo } = require('../services/yelmo-cinema')

const SYNOPSIS_MAX_LENGTH = 500

function errorHandler(fn) {
  return function (ctx) {
    return fn(ctx).catch(err => {
      console.log('errorHandler', err.message)
      ctx.reply(`Ay! Creo que he sufrido un cortocircuito...`)
    })
  }
}

async function getFuelPriceHandler(ctx) {
  const {
    entities,
    text,
  } = ctx.message

  const commandEntity = entities.find(entity => entity.type === 'bot_command')
  let id = null
  if (commandEntity.length < text.length) {
    id = text.slice(commandEntity.length).trim()
  }

  const stations = await getFuelPrices(id)
  const message = stations.reduce((result, station) => {
    const row = `ID: ${station.id}\nPrecio: ${station.price} € el litro\nNombre: ${station.name}\nDirección: ${station.address.toLowerCase()}, (${station.city.trim()})\n`
    return `${result}${row}\n`
  }, 'Precios gasolineras en Rivas para diesel A\n\n')

  ctx.reply(message)
}

async function getYelmoInfoHandler(ctx) {
  const data = await getYelmoInfo()
  const {
    date,
    movies,
  } = data

  ctx.reply(`Cartelera en Yelmo cine H2O para el ${date}`)
    .then(() => {
      movies.forEach(movie => {
        const {
          sessions,
          title,
          synopsis,
          premiere,
          minutes,
          genre,
        } = movie

        const sessionString = sessions.map(i => `${i.time} (${i.format})`).join(', ')
        const limitedSynopsis = synopsis.length > SYNOPSIS_MAX_LENGTH ? `${synopsis.slice(0, SYNOPSIS_MAX_LENGTH)}...` : synopsis
        const row = `${premiere ? `¡¡ESTRENO!!\n\n` : ''}Título: ${title}\nDuración: ${minutes} min\nGénero: ${genre}\nSinópsis: ${limitedSynopsis}\n\nSesiones: ${sessionString}`

        ctx.reply(row)
      })
    })
}

module.exports = {
  errorHandler,
  getFuelPriceHandler,
  getYelmoInfoHandler,
}
