import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useDispatch, useSelector } from "react-redux";
import { getStats } from "../../API/artist/artist";
import ArtistList from "../Artist/ArtistList";
import { FaHeart, FaUsers, FaMusic, FaHeadphones, FaUserPlus } from "react-icons/fa";

function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const { stats } = useSelector((store) => store.artist);
  const [followingArtists, setFollowingArtists] = useState([]);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  const isArtist = user?.role === "artist";

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData) {
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    dispatch(getStats());
  }, [dispatch]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <NavBar />

      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="text-center">
            <div className="mb-6 animate-bounce">
              <span className="text-7xl md:text-8xl">🎵</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Welcome to My Music, {user?.userName?.split(' ')[0] || 'Guest'}!
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover, create, and manage your music collection. Listen to amazing tracks from talented artists.
            </p>
            
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => navigate("/music")}
                className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition shadow-md"
              >
                Start Listening
              </button>
              {!isArtist && (
                <button
                  onClick={() => navigate("/following-artists")}
                  className="px-6 py-2 bg-white text-purple-600 rounded-full border border-purple-200 hover:bg-purple-50 transition shadow-md flex items-center gap-2"
                >
                  <FaHeart className="text-red-500" />
                  My Favorite Artists
                </button>
              )}
              {isArtist && (
                <button
                  onClick={() => navigate("/artist/network")}
                  className="px-6 py-2 bg-white text-purple-600 rounded-full border border-purple-200 hover:bg-purple-50 transition shadow-md flex items-center gap-2"
                >
                  <FaUsers className="text-purple-500" />
                  My Network
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Explore MusicApp
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            onClick={() => navigate("/albums")}
            className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2"
          >
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform inline-block">
                📀
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Albums</h3>
              <p className="text-purple-100">Browse and explore music albums</p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Discover amazing albums from various artists. View album details, track listings, and more.
              </p>
              <div className="flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
                Explore Albums →
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate("/music")}
            className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2"
          >
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform inline-block">
                🎵
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Music Library</h3>
              <p className="text-pink-100">Listen to your favorite tracks</p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Access your complete music collection. Create playlists, like songs, and enjoy seamless listening.
              </p>
              <div className="flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
                Browse Music →
              </div>
            </div>
          </div>
        </div>

          {/* <div className="mt-8">
            <div
              onClick={() => navigate("/liked-songs")}
              className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <FaHeart className="text-4xl" />
                  <div>
                    <h3 className="text-xl font-bold">Your Liked Songs</h3>
                    <p className="text-red-100 text-sm">All your favorite tracks in one place</p>
                  </div>
                </div>
                <div className="text-sm bg-white/20 px-4 py-2 rounded-full">
                  View Collection →
                </div>
              </div>
            </div>
          </div> */}
        

        <div className="mt-12">
          <ArtistList />
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div className="group cursor-pointer" onClick={() => navigate("/albums")}>
              <div className="text-4xl font-bold group-hover:scale-110 transition-transform">
                {stats?.album || 0}
              </div>
              <div className="text-purple-100 mt-2">Albums Available</div>
            </div>
            <div className="group cursor-pointer" onClick={() => navigate("/music")}>
              <div className="text-4xl font-bold group-hover:scale-110 transition-transform">
                {stats?.music || 0}
              </div>
              <div className="text-purple-100 mt-2">Total Musics</div>
            </div>

             <div>
              <div className="text-4xl font-bold group-hover:scale-110 transition-transform">
                {stats?.artist || 0}
              </div>
              <div className="text-purple-100 mt-2">Total Artist</div>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;