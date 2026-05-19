import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./Components/Auth/Login";
import RegisterPage from "./Components/Auth/Register";
import PrivateRoute from "./Components/Auth/PrivateRoute";
import HomeRoutes from "./Routes/HomeRoutes ";
import MusicRoutes from "./Routes/MusicRoutes";
import AlbumRoutes from "./Routes/AlbumRoutes";
import PlaylistRoutes from "./Routes/PlaylistRoutes";
import ArtistRoutes from "./Routes/ArtistRoutes";
import ForgotPasswordPage from "./Components/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./Components/Auth/ResetPasswordPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/reset-password/:token"
          element={<ResetPasswordPage />}
        />

        <Route element={<PrivateRoute />}>

          {HomeRoutes}
          {MusicRoutes}
          {AlbumRoutes}
          {PlaylistRoutes}
          {ArtistRoutes}

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;