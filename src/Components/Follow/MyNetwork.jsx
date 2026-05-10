import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUsers,
  FaUserPlus,
  FaSearch,
  FaUserFriends,
  FaEllipsisH,
  FaMagic,
  FaMicrophone,
  FaHeadphones,
  FaGem,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import {
  getFollower,
  getFollowing,
  toggleFollowArtist,
} from "../../API/artist/artist";
import MusicalBackButton from "../UI/MusicalBackButton";

const MyNetwork = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("followers");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredUser, setHoveredUser] = useState(null);

  const {
    followers = [],
    following = [],
    loading,
  } = useSelector((state) => state.artist);

 

  useEffect(() => {
    if (activeTab === "followers") {
      dispatch(getFollower());
    } else {
      dispatch(getFollowing());
    }
  }, [activeTab, dispatch]);

  const list = activeTab === "followers" ? followers : following;

  const filteredList = list.filter((user) =>
    (user.artistProfile?.stageName || user.userName)
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleFollow = async (id) => {
    await dispatch(toggleFollowArtist(id));
  };

  const getRoleIcon = (role) => {
    if (role === "artist") return <FaMicrophone className="text-pink-500" size={12} />;
    return <FaUserFriends className="text-purple-400" size={12} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-purple-200">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-gradient-to-br from-amber-100/40 to-rose-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-100/30 to-purple-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-stone-100/20 to-gray-100/20 rounded-full blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                        <MusicalBackButton to="/home" />


              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-pink-400 to-purple-400 blur-md opacity-30 animate-pulse" />
                  <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <FaGem className="text-white text-sm" />
                  </div>
                </div>

                <div className="leading-tight">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold letter-spacing-0.5">
                    Creative Network
                  </p>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent tracking-tight">
                    My Network
                  </h1>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <FaSearch
                  size={14}
                  className="text-gray-300 group-focus-within:text-pink-500 transition-all duration-300"
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

          <div className="flex items-center justify-between mt-6 pt-2">
            <div className="flex gap-1">
              {[
                { id: "followers", icon: FaUsers, label: "Followers" },
                { id: "following", icon: FaUserPlus, label: "Following" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const count =
                  tab.id === "followers"
                    ? followers.length
                    : following.length;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
            group relative px-5 py-2.5 rounded-full 
            transition-all duration-300 
            ${isActive
                        ? "bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-gray-800"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }
          `}
                  >
                    <div className="flex items-center gap-2.5">
                      <tab.icon
                        size={15}
                        className={`transition-colors ${isActive
                          ? "text-pink-500"
                          : "text-gray-400 group-hover:text-gray-500"
                          }`}
                      />

                      <span className="text-sm font-medium capitalize">
                        {tab.label}
                      </span>

                      {isActive && (
                        <span
                          className="
                  relative px-2 py-0.5 rounded-full text-[11px] font-semibold 
                  transition-all duration-300
                  bg-gradient-to-r from-pink-500 to-purple-500 
                  text-white shadow-sm
                "
                        >
                          {count}
                        </span>
                      )}
                    </div>

                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-10 relative z-10">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
              <p className="text-purple-600 font-medium">Loading network...</p>
            </div>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-48">
            <div className="inline-flex p-6 bg-gradient-to-br from-amber-50 to-rose-50 rounded-3xl mb-6">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <FaUsers className="text-3xl text-amber-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No connections yet</h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              {activeTab === "followers"
                ? "Start creating amazing content to attract followers to your creative journey."
                : "Follow other artists to discover inspiration and build your network."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredList.map((user, idx) => (
              <div
                key={user._id}
                className="bg-white rounded-2xl border border-gray-100 transition-all duration-300 overflow-hidden shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-1
      hover:border-rose-100"
                onClick={() => {
                  { user.role === "artist" && navigate(`/artist/music/${user._id}`) }
                }}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-4 flex-1">

                      <div className="relative">
                        <div
                          className="
                  w-14 h-14 rounded-2xl overflow-hidden
                  ring-2 ring-white shadow-sm
                  transition-transform duration-300
                  group-hover:scale-105
                "
                        >
                          {user?.artistProfile?.profileImage ? (
                            <img
                              src={user.artistProfile.profileImage}
                              alt={user.userName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-purple-400 text-white text-xl font-semibold">
                              {user.userName?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {user.isFollowing &&
                          activeTab === "followers" && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-pink-400 to-purple-400 rounded-lg flex items-center justify-center shadow-sm rotate-12">
                              <FaMagic
                                size={8}
                                className="text-white"
                              />
                            </div>
                          )}
                      </div>

                      {/* DETAILS */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">

                          <h3
                            className="
                    font-semibold text-gray-800 text-base
                    transition-colors duration-300
                    group-hover:text-rose-500
                  "
                          >
                            {user.artistProfile?.stageName ||
                              user.userName}
                          </h3>

                          {user.I_Follow &&
                            activeTab === "followers" && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                                <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                                Mutual
                              </span>
                            )}

                        </div>

                        <div className="flex items-center gap-2 text-xs">

                          <span className="flex items-center gap-1 text-gray-500">
                            {getRoleIcon(user.role)}
                            <span className="capitalize">
                              {user.role}
                            </span>
                          </span>

                          <span className="w-1 h-1 bg-gray-300 rounded-full" />

                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">

                      {activeTab === "followers" ? (
                        user.role === "artist" ? (
                          <button
                            onClick={() => handleFollow(user._id)}
                            className={`px-5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${user.isFollowing
                              ? "bg-gray-50 text-gray-600 hover:bg-gray-100"
                              : "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-sm hover:shadow"
                              }`}
                          >
                            {user.I_Follow
                              ? "Following"
                              : "Follow Back"}
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
                            <FaUserFriends
                              size={12}
                              className="text-gray-400"
                            />
                            <span className="text-xs text-gray-500">
                              Fan
                            </span>
                          </div>
                        )
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFollow(user._id)
                          }
                          }
                          className="px-5 py-2 rounded-xl text-xs font-medium border border-gray-200 text-gray-600 hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200"
                        >
                          Unfollow
                        </button>
                      )}

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

export default MyNetwork;