/**
 * This service fetches movies data from Yelmo cines
 */
const fetch = require('node-fetch')

const LANGUAGE = 'ESPAÑOL'
const CINEMA_KEY = 'rivas-h2o'

const requestData = { cityKey: 'madrid' }
const apiUrl = 'https://yelmocines.es/now-playing.aspx/GetNowPlaying'

const headers = {
  'Content-type': 'application/json',
  'Accept': 'application/json',
}

const requestConfig = {
  method: 'POST',
  headers,
  body: JSON.stringify(requestData)
}

const formatSessions = formats => {
    const validFormats = formats.filter(i => i.Language === LANGUAGE)
    return validFormats.reduce((result, current) => {
        const type = current.Name
        const items = current.Showtimes
        const batch = items.map(i => ({
            time: i.Time,
            screen: i.Screen,
            format: type,
        }))
        return [...result, ...batch]
    }, [])
}

const formatData = data => {
    const cineData = data.d.Cinemas.find(i => i.Key === CINEMA_KEY)
    const today = cineData.Dates[0]

    const movies = today.Movies
    const dateString = today.ShowtimeDate

    const formattedMovies = movies.map(i => ({
        title: i.Title,
        minutes: i.RunTime,
        image: i.Poster,
        genre: i.Gender.toLowerCase(),
        synopsis: i.Synopsis,
        premiere: i.Status === 'Estreno',
        sessions: formatSessions(i.Formats),
    })).sort((a, b) => a.premiere ? -1 : 1)

    return {
      date: dateString,
      movies: formattedMovies,
    }
}

const getRawYelmoInfo = () => fetch(apiUrl, requestConfig)
  .then(response => response.json())

const getYelmoInfo = () => getRawYelmoInfo().then(formatData)

module.exports = {
  getRawYelmoInfo,
  getYelmoInfo,
}
