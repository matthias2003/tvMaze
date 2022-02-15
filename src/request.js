export const getShowsByKey = () => {
    return fetch(`https://api.tvmaze.com/search/shows?q=${key}`)
    .then(resp => resp.json())
}

export const getShowById = () => {
    return fetch(`https://api.tvmaze.com/search/shows/${id}?embed=cast`)
    .then(resp => resp.json())
}