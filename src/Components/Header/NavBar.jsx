import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  User,
  Mail,
  Camera,
  Save,
  Loader2,
  Shield,
  Calendar,
  Music,
  Heart,
  LogOut,
  Settings,
  Edit2,
  Play,
  Plus,
  ThumbsUp,
  ChevronDown,
  Menu
} from "lucide-react";
import Swal from 'sweetalert2';
import ArtistProfileModal from "./ProfileModal";
import { FaThumbsUp } from "react-icons/fa";
import ChangePassword from "../Auth/ChangePassword";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (token && userData) {
      setUser(userData);
    } else {
      setUser(null);
    }
  }, [token, location]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
        setIsMenuOpen(false);
      }
    });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="text-white text-xl">🎵</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                MyMusic
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => navigate("/albums")}
                className={`text-gray-700 hover:text-purple-600 transition-colors font-medium flex items-center gap-1 ${isActive("/albums") ? "text-purple-600 border-b-2 border-purple-600" : ""
                  }`}
              >
                <span>📀</span> Albums
              </button>
              <button
                onClick={() => navigate("/music")}
                className={`text-gray-700 hover:text-purple-600 transition-colors font-medium flex items-center gap-1 ${isActive("/music") ? "text-purple-600 border-b-2 border-purple-600" : ""
                  }`}
              >
                <span>🎵</span> Music
              </button>

              <button
                onClick={() => navigate("/create-playlist")}
                className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Playlist
              </button>

              <button
                onClick={() => navigate("/favorite-musics")}
                className="bg-pink-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2"
              >
                ❤️ Favorite Songs
              </button>

            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-3 focus:outline-none cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">

                    {user?.userName ? user.userName[0].toUpperCase() :
                      user?.email?.[0]?.toUpperCase() || "U"}

                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-700">
                      {user?.stageName || user?.userName || user?.email?.split('@')[0]}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.role === "artist" ? "Artist" : "Listener"}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform ${isMenuOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-100 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                          {
                              user?.userName ? user.userName[0].toUpperCase() : "U"
                          }
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {user?.userName || "User"}
                          </p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        navigate("/playlist");
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      My Playlists
                    </button>
                    <button
                      onClick={() => {
                        navigate("/liked-songs");
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FaThumbsUp className="w-4 h-4" />
                      Liked songs
                    </button>

                    <button
                      onClick={() => {
                        setIsPasswordModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Change Password
                    </button>

                    {user?.role === "artist" && (
                      <button
                        onClick={() => {
                          setIsArtistModalOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Artist Profile
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 border-t border-gray-100 mt-1 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-purple-600 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="space-y-3">
                <button
                  onClick={() => {
                    navigate("/albums");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-purple-50 rounded-lg"
                >
                  📀 Albums
                </button>
                <button
                  onClick={() => {
                    navigate("/music");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-purple-50 rounded-lg"
                >
                  🎵 Music
                </button>



                <div className="px-3 py-2 border-t border-gray-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        user?.stageName ? user.stageName[0].toUpperCase() :
                          user?.userName ? user.userName[0].toUpperCase() : "U"
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {user?.stageName || user?.userName || "User"}
                      </div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                  </div>
                </div>

                {user?.role === "artist" && (
                  <button
                    onClick={() => {
                      setIsArtistModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Artist Profile
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsPasswordModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Change Password
                </button>

                <button
                  onClick={() => {
                    navigate("/playlist");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  My Playlists
                </button>

                <button
                  onClick={() => {
                    navigate("/liked-songs");
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <FaThumbsUp className="w-4 h-4" />
                  Liked songs
                </button>

                <button
                  onClick={() => {
                    navigate("/favorite-musics");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-pink-600 hover:bg-pink-50 rounded-lg"
                >
                  ❤️ Favorite Songs
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {isArtistModalOpen
        && <ArtistProfileModal
          isOpen={isArtistModalOpen}
          onClose={() => setIsArtistModalOpen(false)}
          user={user}
        />}

      {isPasswordModalOpen && (
        <ChangePassword
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      )}
    </>
  );
}

export default NavBar;