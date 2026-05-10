import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Clock,
  Music,
  Plus,
  Trash2,
  AlertCircle,
  Edit2,
  Edit2Icon,
  EditIcon
} from "lucide-react";
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from "react-redux";
import { deletePlayList, getPlayList } from "../../API/playList/playlist";
import { handleDelete } from "../../utils/handleDelete";
import { formatDate, getTotalDuration } from "../../utils/helper";
import MusicalBackButton from "../UI/MusicalBackButton";

function PlaylistList() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const { playList, loading } = useSelector((store) => store.playlist);

  useEffect(() => {

    dispatch(getPlayList());
  }, [dispatch]);

  const handleDeletePlaylist = (id) => {
    handleDelete({
      dispatch,
      id,
      action: deletePlayList,
      title: "Delete Playlist?",
      successText: "Playlist deleted successfully",
    });
  };




  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <p className="text-purple-600 font-medium">Loading your playlists...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
  <MusicalBackButton to="/home"/>

          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              My Playlists
            </h1>
            <p className="text-gray-600 mt-2">
              {playList?.length} {playList?.length === 1 ? 'playlist' : 'playlists'} created
            </p>
          </div>
          <button
            onClick={() => navigate("/create-playlist")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Playlist
          </button>
        </div>

        {playList?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
              <Music className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No playlists yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first playlist and start curating your favorite music
            </p>
            <button
              onClick={() => navigate("/create-playlist")}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            >
              Create Playlist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playList?.map((playlist) => (
              <div
                key={playlist._id}
                onClick={() => navigate(`/playlist/${playlist._id}`)}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-200 to-pink-200">
                  {playlist.image || playlist.musics[0].image ? (
                    <img
                      src={playlist.image || playlist.musics[0].image}
                      alt={playlist.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-16 h-16 text-purple-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
                    <div className="bg-white p-4 rounded-full shadow-lg transform hover:scale-110 transition">
                      <Play className="w-6 h-6 text-purple-600 ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 text-xs rounded-full">
                    {playlist.musics?.length || 0} songs
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800 truncate flex-1">
                      {playlist.title}
                    </h3>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/update-playlist/${playlist._id}`)
                      }}
                      className="text-blue-500 hover:text-blue-700 transition-colors ml-2 opacity-0 group-hover:opacity-100"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePlaylist(playlist._id);
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors ml-2 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {playlist.description || "No description"}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{getTotalDuration(playlist)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Music className="w-3 h-3" />
                      <span>{playlist.musics?.length || 0} tracks</span>
                    </div>
                    <div>
                      <span>{formatDate(playlist.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaylistList;