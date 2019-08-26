const fetch = require('node-fetch')

const requestData = require('../config/fuel-price-informer-query')
const apiUrl = 'https://geoportalgasolineras.es/rest/busquedaEstaciones'

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}

const requestConfig = {
  method: 'POST',
  headers,
  body: JSON.stringify(requestData),
}

const getRawFuelPrices = () => fetch(apiUrl, requestConfig)
  .then(response => response.json())

const getFuelPrices = (id = null) => getRawFuelPrices().then(processFuelData(id))

const processFuelData = (id = null) => data => {
  if (!data || !Array.isArray(data.estaciones) || !data.estaciones.length) {
    throw new Error('No stations data')
  }

  const stations = data.estaciones
  const validStations = stations.filter(station => {
    const hasPrice = station.precio !== null && !isNaN(Number(station.precio))
    const stationInfo = station.estacion
    const hasId = stationInfo && stationInfo.id !== 'undefined'
    const hasName = typeof stationInfo.rotulo === 'string' && stationInfo.rotulo.length
    const hasAddress = typeof stationInfo.direccion === 'string' && stationInfo.direccion.length
    const hasCity = typeof stationInfo.localidad === 'string' && stationInfo.localidad.length

    const commonFilter = hasPrice && hasId && hasName && hasAddress && hasCity
    const matchById = Number(id) === Number(stationInfo.id)
    return id !== null ? (commonFilter && matchById) : commonFilter
  })

  return validStations
    .map(station => ({
      id: station.estacion.id,
      price: parseFloat(station.precio),
      name: station.estacion.rotulo,
      address: station.estacion.direccion,
      city: station.estacion.localidad,
    }))
    .sort((a, b) => a.price < b.price ? -1 : 1)
}

module.exports = {
  getRawFuelPrices,
  getFuelPrices,
}
