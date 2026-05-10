// MusicList.jsx (updated)
import { useState } from "react";
import { Play, Pause, Heart, Trash2, ThumbsUp, Clock } from "lucide-react";
import { deleteMusic, toggleFavorite, toggleLike } from "../../API/music/music";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import CurrentTrackPlayer from "./CurrentTrack";
import { handleDelete } from "../../utils/handleDelete";
import { formatTime } from "../../utils/helper";

function MusicList({ musicList = [], role, activeTab, favorite, onDelete, loading, like }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const dispatch = useDispatch();


  const handleTrackSelect = (track) => {
    if (currentTrack?._id === track._id) {
      setIsPlaying(!isPlaying);
      return;
    }
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleToggleFavorite = (musicId) => {
    dispatch(toggleFavorite(musicId));
    if (currentTrack?._id === musicId && favorite) {
      setCurrentTrack(null);
      setIsPlaying(false);
    }
  };

  const handleLike = (trackId) => {
    dispatch(toggleLike(trackId));
  };

  const handleDeleteClick = (id) => {
    handleDelete({
      dispatch,
      id,
      action: deleteMusic,
      title: "Delete Music?",
      text: "This music will be permanently deleted!",
      successText: "Music has been deleted successfully",
    });
  };

 
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <p className="text-purple-600 font-medium">Loading amazing musics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-2 pb-32">
        {musicList.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md border border-purple-100">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-purple-700 mb-2">
              No songs found
            </h3>
            <p className="text-purple-500">
              {activeTab === "my-songs"
                ? "You haven't uploaded any songs yet"
                : "Try adjusting your search"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {musicList.map((track, index) => (
              <div
                key={track?._id || index}
                onClick={() => handleTrackSelect(track)}
                className={`group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition cursor-pointer ${currentTrack?._id === track?._id ? 'ring-2 ring-purple-500 shadow-lg' : ''
                  }`}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={track?.image}
                    alt={track?.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
                    <div className="bg-white p-4 rounded-full shadow-lg transform hover:scale-110 transition">
                      {currentTrack?._id === track?._id && isPlaying ? (
                        <Pause className="w-6 h-6 text-purple-600" />
                      ) : (
                        <Play className="w-6 h-6 text-purple-600 ml-0.5" />
                      )}
                    </div>
                  </div>

                  {currentTrack?._id === track?._id && isPlaying && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 text-xs rounded-full flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      PLAYING
                    </div>
                  )}

                  {(favorite || track.isFavorite !== undefined) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(track._id);
                      }}
                      className="absolute top-2 right-2 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:scale-110"
                    >
                      <Heart
                        className={`w-4 h-4 transition ${track?.isFavorite || favorite
                          ? "text-pink-500 fill-pink-500"
                          : "text-gray-600"
                          }`}
                      />
                    </button>
                  )}
                </div>

               <div className="p-4 flex justify-between items-start">
  <div className="flex-1 min-w-0">
    <h3 className="font-bold text-lg truncate text-gray-800">
      {track?.title}
    </h3>

    <p className="text-sm text-purple-500">
      {track?.artist?.artistProfile?.stageName}
    </p>

    <div className="flex items-center gap-2 mt-2 flex-wrap">
     {track?.genre && (
        <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200 shadow-sm">
          🎵 {track.genre}
        </span>
      )}

      {track?.duration && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-[11px] font-medium">
          <Clock className="w-3 h-3" />
          {formatTime(track.duration)}
        </div>
      )}
    </div>
  </div>

  <div className="flex items-center gap-3">
    {(like || track?.isLiked !== undefined) && (
      <div className="relative group">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLike(track._id);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer
          hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
          bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100
          shadow-sm hover:shadow-md"
        >
          <div className="relative group">
            <ThumbsUp
              className={`transition-all duration-200 overflow-hidden
              ${
                track?.isLiked
                  ? "w-4 h-4 text-purple-500 fill-purple-500"
                  : "w-0 h-4 opacity-0 group-hover:w-4 group-hover:opacity-100 text-gray-400 group-hover:text-purple-500"
              }`}
            />
          </div>

          <span
            className={`text-xs font-semibold ${
              track?.isLiked ? "text-purple-600" : "text-gray-500"
            }`}
          >
            {track?.likesCount || 0}
          </span>

          <span className="text-xs text-gray-400">🎵</span>
        </button>
      </div>
    )}

    {onDelete && activeTab === "my-songs" && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteClick(track._id);
        }}
        className="text-red-500 hover:text-red-700 transition flex items-center gap-1 text-sm p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    )}
  </div>
</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {currentTrack && (
        <CurrentTrackPlayer
          currentTrack={currentTrack}
          musicList={musicList}
          onTrackChange={setCurrentTrack}
          isPlaying={isPlaying}
          onPlayStateChange={setIsPlaying}
        />
      )}
    </>
  );
}

export default MusicList;