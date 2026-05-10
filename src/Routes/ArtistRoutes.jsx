import { Route } from "react-router-dom";

import ArtistMusicDetails from "../Components/Artist/ArtistMusicDetails";
import FollowingArtists from "../Components/Follow/FollowingArtists";
import MyNetwork from "../Components/Follow/MyNetwork";

const ArtistRoutes = () => {
  return (
    <>
      <Route
        path="/artist/music/:id"
        element={<ArtistMusicDetails />}
      />

      <Route
        path="/following-artists"
        element={<FollowingArtists />}
      />

      <Route
        path="/artist/network"
        element={<MyNetwork />}
      />
    </>
  );
};

export default ArtistRoutes;