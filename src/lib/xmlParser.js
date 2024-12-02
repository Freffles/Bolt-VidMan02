export function parseMovieXML(xmlString) {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlString, "text/xml")

  // Helper function to get text content safely
  const getTextContent = (element, tagName) => {
    const node = element.getElementsByTagName(tagName)[0]
    return node ? node.textContent : ''
  }

  // Helper function to get multiple elements
  const getMultipleElements = (element, tagName) => {
    return Array.from(element.getElementsByTagName(tagName)).map(el => el.textContent)
  }

  // Helper function to parse actors
  const parseActors = (element) => {
    return Array.from(element.getElementsByTagName('actor')).map(actor => ({
      name: getTextContent(actor, 'name'),
      role: getTextContent(actor, 'role'),
      thumb: getTextContent(actor, 'thumb')
    }))
  }

  return {
    title: getTextContent(xmlDoc, 'title'),
    originalTitle: getTextContent(xmlDoc, 'originaltitle'),
    rating: parseFloat(getTextContent(xmlDoc, 'rating')) || 0,
    year: parseInt(getTextContent(xmlDoc, 'year')) || null,
    outline: getTextContent(xmlDoc, 'outline'),
    plot: getTextContent(xmlDoc, 'plot'),
    runtime: parseInt(getTextContent(xmlDoc, 'runtime')) || 0,
    poster: getTextContent(xmlDoc, 'thumb'),
    fanart: getTextContent(xmlDoc, 'fanart'),
    mpaa: getTextContent(xmlDoc, 'mpaa'),
    genres: getMultipleElements(xmlDoc, 'genre'),
    studio: getTextContent(xmlDoc, 'studio'),
    director: getTextContent(xmlDoc, 'director'),
    actors: parseActors(xmlDoc),
    premiered: getTextContent(xmlDoc, 'premiered'),
    watched: getTextContent(xmlDoc, 'watched') === 'true',
    playcount: parseInt(getTextContent(xmlDoc, 'playcount')) || 0,
    id: getTextContent(xmlDoc, 'id')
  }
}
