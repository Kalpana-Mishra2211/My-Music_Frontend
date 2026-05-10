import { Route } from "react-router-dom";

import MusicListPage from "../Components/Music/Music";
import FavoriteMusics from "../Components/Music/FavoriteMusics";
import LikedSongs from "../Components/Music/LikedSongs";

const MusicRoutes = () => {
  return (
    <>
      <Route path="/music" element={<MusicListPage />} />
      <Route path="/favorite-musics" element={<FavoriteMusics />} />
      <Route path="/liked-songs" element={<LikedSongs />} />
    </>
  );
};

export default MusicRoutes;