import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  X,
  Music,
  Upload,
  Trash2,
  Save,
  ArrowLeft,
  Search,
  Check,
  AlertCircle,
  Play,
  Pause,
  Clock,
  User,
  ListMusic,
  Disc3
} from "lucide-react";
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from "react-redux";
import { getMusicList } from "../../API/music/music";
import CurrentTrackPlayer from "../UI/CurrentTrack";
import { createPlayList, getPlayListById, updatePlayList, clearPlayListById } from "../../API/playList/playlist";
import MusicalBackButton from "../UI/MusicalBackButton";

function CreatePlaylist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState({})

  const dispatch = useDispatch();
  const { musicsList } = useSelector((store) => store.music);
  const { playListById, loading: playListLoading } = useSelector((store) => store.playlist);
  const [originalData, setOriginalData] = useState(null);


  const [playlistData, setPlaylistData] = useState({
    title: "",
    description: "",
    imageFile: null,
    imagePreview: null,
    selectedSongs: [],
  });

  useEffect(() => {
    dispatch(clearPlayListById())
    if (id) {
      dispatch(getPlayListById(id));
    }
  }, [dispatch, id]);


  useEffect(() => {
    if (id && playListById) {
      setPlaylistData((pre) => ({
        ...pre,
        title: playListById.title || "",
        description: playListById.description || "",
        selectedSongs: playListById.musics.map((music) => music) || [],
        imagePreview: playListById.image || null

      }))
      setOriginalData(playListById);
    }

  }, [playListById])



  useEffect(() => {
    dispatch(getMusicList());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlaylistData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
  setError(prev => ({
        ...prev,
        imageFile: ""
      }))
    const allowedType = ["image/jpeg", "image/png"]

    if (!allowedType.includes(file.type)) {
      setError(prev => ({
        ...prev,
        imageFile: "Only JPG and PNG files are allowed"
      }))
      return;
    }

    if (file) {
      setPlaylistData(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handlePlaySong = (e, song) => {
    e.stopPropagation();

    if (currentTrack?._id === song._id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(song);
      setIsPlaying(true);
    }
  };

  const toggleSongSelection = (song) => {
    setPlaylistData(prev => {
      const isSelected = prev.selectedSongs.some(s => s._id === song._id);

      if (isSelected) {
        return {
          ...prev,
          selectedSongs: prev.selectedSongs.filter(s => s._id !== song._id)
        };
      } else {
        return {
          ...prev,
          selectedSongs: [...prev.selectedSongs, song]
        };
      }
    });
  };
  if (playListLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <p className="text-purple-600 font-medium">Loading...</p>
          </div>
        </div>
      </div>
    );
  }


  const removeSong = (songId) => {
    setPlaylistData(prev => ({
      ...prev,
      selectedSongs: prev.selectedSongs.filter(s => s._id !== songId)
    }));
  };

  const filteredSongs = musicsList.filter(song =>
    song?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song?.artist?.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getChangedData = () => {
    const formData = new FormData();

    if (playlistData.title !== originalData.title) {
      formData.append("title", playlistData.title);
    }

    if (playlistData.description !== originalData.description) {
      formData.append("description", playlistData.description);
    }

    const originalMusics = (originalData.musics || []).map(m => m._id);
    const currentMusics = playlistData.selectedSongs.map(m => m._id);

    const isMusicChanged =
      JSON.stringify(originalMusics) !== JSON.stringify(currentMusics);

    if (isMusicChanged) {
      currentMusics.forEach((id) => {
        formData.append("musics", id);
      });
    }

    if (playlistData.imageFile) {
      formData.append("image", playlistData.imageFile);
    }

    return formData;
  };

  const handleSubmitPlaylist = async () => {
    try {
      if (!playlistData?.title.trim()) {
        return Swal.fire({
          icon: "error",
          title: "Missing Title",
          text: "Please enter playlist title",
        });
      }

      if (!playlistData?.selectedSongs.length) {
        return Swal.fire({
          icon: "error",
          title: "No Songs Selected",
          text: "Please select at least one song",
        });
      }

      Swal.fire({
        title: id ? "Updating Playlist..." : "Creating Playlist...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      let formData;

      if (id) {
        formData = getChangedData();
        await dispatch(updatePlayList({ id, formData })).unwrap();
      }

      else {
        formData = new FormData();

        formData.append("title", playlistData.title);
        formData.append("description", playlistData.description || "");

        playlistData.selectedSongs.forEach((song) => {
          formData.append("musics", song._id);
        });

        if (playlistData.imageFile) {
          formData.append("image", playlistData.imageFile);
        }

        await dispatch(createPlayList(formData)).unwrap();
      }

      Swal.fire({
        icon: "success",
        title: id ? "Updated!" : "Created!",
        text: `Playlist ${id ? "updated" : "created"} successfully`,
      }).then(() => {
        navigate(-1);
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error || "Something went wrong",
      });
    }
  };

  const totalDuration = playlistData?.selectedSongs?.reduce((total, song) => total + (song.duration || 0), 0);
  const formattedTotalDuration = `${Math.floor(totalDuration / 60)}:${Math.floor(totalDuration % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <MusicalBackButton to="/playlist" />


          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {id ? "Update Playlist" : "Create New Playlist"}
            </h1>
            <p className="text-gray-600 mt-2">Create your perfect music collection</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Playlist Cover
              </label>
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 shadow-md">
                    {playlistData?.imagePreview || playlistData?.selectedSongs[0] ? (
                      <img
                        src={playlistData?.imagePreview || playlistData?.selectedSongs[0]?.image}
                        alt="Playlist cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <Music className="w-12 h-12 text-purple-400" />
                        <span className="text-xs text-gray-400 mt-2">No image</span>
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 transition-colors shadow-lg">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                    {error?.imageFile && (
              <p className="text-red-500 text-xs mt-1">
                {error.imageFile}
              </p>
            )}
                <p className="text-xs text-gray-500 mt-3">Click the upload button to add a cover image</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Playlist Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Playlist Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={playlistData?.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Chill Vibes, Workout Mix, Study Beats"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    maxLength="50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {playlistData?.title.length}/50 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={playlistData?.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Describe your playlist..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    maxLength="200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {playlistData?.description.length}/200 characters
                  </p>
                </div>
              </div>
            </div>


          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 ">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add Songs</h2>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search songs by title or artist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto hide-scrollbar">
              {!musicsList.length ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading songs...</p>
                </div>
              ) : filteredSongs.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No songs found</p>
                </div>
              ) : (
                filteredSongs.map((song) => {
                  const isSelected = playlistData?.selectedSongs.some(s => s._id === song._id);
                  const isCurrentlyPlaying = currentTrack?._id === song._id && isPlaying;

                  return (
                    <div
                      key={song._id}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${isSelected
                        ? "bg-purple-50 border-2 border-purple-300"
                        : "hover:bg-gray-50 border-2 border-transparent"
                        }`}
                      onClick={() => toggleSongSelection(song)}
                    >
                      <div className="relative group">
                        <img
                          src={song.image || `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/50/50`}
                          alt={song.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <button
                          onClick={(e) => handlePlaySong(e, song)}
                          className="absolute inset-0 bg-black/50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {isCurrentlyPlaying ? (
                            <Pause className="w-5 h-5 text-white" />
                          ) : (
                            <Play className="w-5 h-5 text-white ml-0.5" />
                          )}
                        </button>
                        {isCurrentlyPlaying && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{song.title}</p>
                        <p className="text-sm text-gray-500">{song.artist?.userName}</p>
                      </div>

                      <div className="text-sm text-gray-400">
                        {song.duration ? `${Math.floor(song.duration / 60)}:${Math.floor(song.duration % 60).toString().padStart(2, '0')}` : "0:00"}
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4 justify-end">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitPlaylist}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {id ? "Updating..." : "Creating..."}              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {id ? "Update Playlist" : " Create Playlist"}
              </>
            )}
          </button>
        </div>
      </div>

      {currentTrack && isPlaying && (
        <CurrentTrackPlayer
          currentTrack={currentTrack}
          musicList={filteredSongs}
          onTrackChange={setCurrentTrack}
          isPlaying={isPlaying}
          onPlayStateChange={setIsPlaying}
        />
      )}
    </div>
  );
}

export default CreatePlaylist;