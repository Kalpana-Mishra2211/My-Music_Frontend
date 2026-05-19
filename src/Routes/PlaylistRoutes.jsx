import { Route } from "react-router-dom";

import CreatePlaylist from "../Components/PlayList/CreatePlaylist";
import PlaylistList from "../Components/PlayList/PlaylistList";
import PlaylistDetail from "../Components/PlayList/PlaylistDetail";

const PlaylistRoutes = (
    <>
      <Route path="/create-playlist" element={<CreatePlaylist />} />
      <Route path="/playlist" element={<PlaylistList />} />
      <Route path="/playlist/:id" element={<PlaylistDetail />} />
      <Route
        path="/update-playlist/:id"
        element={<CreatePlaylist />}
      />
    </>
  );


export default PlaylistRoutes;