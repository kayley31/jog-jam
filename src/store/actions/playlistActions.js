// Action type
export const ADD_PLAYLIST = 'playlists/add'

// Action creator
export const addPlaylist = (playlist) => ({
    type: ADD_PLAYLIST,
    payload: playlist,
})
