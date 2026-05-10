import { Route } from "react-router-dom";

import AlbumList from "../Components/Album/Album";
import AlbumDetail from "../Components/Album/AlbumDetail";

const AlbumRoutes = () => {
  return (
    <>
      <Route path="/albums" element={<AlbumList />} />
      <Route path="/album/:id" element={<AlbumDetail />} />
    </>
  );
};

export default AlbumRoutes;