import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaMusic,
  FaUserCheck,
  FaHeadphones,
  FaMicrophoneAlt,
  FaPlay,
  FaSearch,
  FaHeart,
  FaClock,
  FaUserPlus,
  FaChartLine
} from "react-icons/fa";
import { getFollowing, toggleFollowArtist } from "../../API/artist/artist";
import MusicalBackButton from "../UI/MusicalBackButton";

const FollowingArtists = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth || {});
  const { following = [], loading} = useSelector((store) => store.artist);

  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredArtist, setHoveredArtist] = useState(null);
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    dispatch(getFollowing());
  }, [dispatch]);


  const filteredArtists = following.filter((artist) => {
    const artistName = (artist.artistProfile?.stageName || artist.userName).toLowerCase();
    const userName = artist.userName?.toLowerCase() || "";
    return artistName.includes(searchTerm.toLowerCase()) ||
      userName.includes(searchTerm.toLowerCase());
  });

  const handleUnfollow = async (artistId, e) => {
    await dispatch(toggleFollowArtist(artistId));
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-pruple-200 relative overflow-hidden">

      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MusicalBackButton to="/home" />
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <FaHeadphones className="text-white text-sm" />
                  </div>
                </div>

                <div className="leading-tight">

                  <h1 className="text-2xl font-semibold text-gray-800 tracking-tight flex items-center gap-2">
                    Following Artists
                    <span className="text-lg text-gray-500 font-medium">
                      ({filteredArtists.length})
                    </span>
                  </h1>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <FaSearch
                  size={14}
                  className="text-gray-300 group-focus-within:text-purple-500 transition-all duration-300"
                />
              </div>
              <input
                type="text"
                placeholder="Search artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-72 bg-gray-50/50 border border-gray-200 rounded-full text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/15 focus:border-purple-300 focus:bg-white transition-all duration-300 hover:border-gray-300 hover:bg-white/80"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 relative z-10">
        {loadind ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
              <p className="text-purple-600 font-medium">Loading your artist...</p>
            </div>
          </div>
        ) : filteredArtists.length === 0 ? (
          <div className="text-center py-48">
            <div className="inline-flex p-6 bg-gradient-to-br from-amber-50 to-rose-50 rounded-3xl mb-6">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <FaHeadphones className="text-3xl text-amber-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No artists followed yet</h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              {searchTerm ? "No artists match your search" : "Discover and follow your favorite artists to start building your music circle 🎧"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredArtists.map((artist, idx) => (
              <div
                key={artist._id}
                className="bg-white rounded-2xl border border-gray-100 transition-all duration-300 overflow-hidden shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-1
      hover:border-rose-100"
                onClick={() => {
                  navigate(`/artist/music/${artist._id}`)
                }}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-4 flex-1">

                      {/* IMAGE */}
                      <div className="relative">
                        {artist.artistProfile?.profileImage ? (
                          <img
                            src={artist.artistProfile.profileImage}
                            alt={
                              artist.artistProfile?.stageName ||
                              artist.userName
                            }
                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-md"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center ring-2 ring-white shadow-md">
                            <FaMicrophoneAlt className="text-amber-500 text-xl" />
                          </div>
                        )}
                      </div>

                      {/* DETAILS */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">

                          <h3 className="font-semibold text-gray-800 text-base">
                            {artist.artistProfile?.stageName ||
                              artist.userName}
                          </h3>

                          <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-pink-50 text-purple-600 px-2 py-0.5 rounded-full">
                            <FaMicrophoneAlt size={8} />
                            Artist
                          </span>

                        </div>

                        <div className="flex items-center gap-2 text-xs">

                          <span className="text-gray-500">
                            {artist.userName}
                          </span>

                          <span className="w-1 h-1 bg-gray-300 rounded-full" />




                        </div>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2">

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnfollow(artist._id)
                        }}
                        className="px-5 py-2 rounded-xl text-xs font-medium border border-gray-200 text-gray-600 hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200 cursor-pointer"
                      >
                        Following
                      </button>

                      <button className="p-2 text-gray-300 hover:text-amber-500 transition-colors">
                        <FaMusic size={14} />
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FollowingArtists;