import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../API/auth/auth";
import musicReducer from "../API/music/music";
import albumReducer from "../API/album/album";
import artistReducer from "../API/artist/artist";
import playlistReducer from "../API/playList/playlist"

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    album:albumReducer,
    music:musicReducer,
    artist:artistReducer,
    playlist:playlistReducer
 },
});