import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Upload,
  Search,
  Heart,
  User,
  ListMusic,
  X,
  FileAudio,
  AlertCircle,
  Image,
  CheckCircle,
  Trash2,
  Loader2,
  ArrowLeft
} from "lucide-react";

import { getMusicList, createMusic, toggleFavorite } from "../../API/music/music";
import MusicList from "../UI/MusicList";
import SongUploadModal from "./SongUploadModal";
import MusicalBackButton from "../UI/MusicalBackButton";

const MusicListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const { musicsList, createLoading, loading } = useSelector((store) => store.music);
  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  const musicList = musicsList || [];

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({ title: "", uri: "", image: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArtist, setSelectedArtist] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (activeTab === "my-songs") {
      dispatch(getMusicList(userData.id));

    }
    else {
      dispatch(getMusicList());
    }
  }, [dispatch, activeTab]);

  const mySongs = musicList.filter(
    (song) => song?.artist?._id === userData.id || song?.artist?.id === userData.id
  );

  const filteredMusic = musicList
    .filter((track) => {
      if (activeTab === "my-songs" && userData.role === "artist") {
        return track?.artist?._id === userData.id || track?.artist?.id === userData.id;
      }
      return true;
    })
    .filter((track) =>
      track?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((track) =>
      selectedArtist === "all"
        ? true
        : track?.artist?.userName === selectedArtist
    );


const handleUploadMusic = async () => {
  if (!uploadData.title || !uploadData.uri) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please fill all required fields",
      confirmButtonColor: "#7c3aed",
    });
    return;
  }

  const formData = new FormData();
  formData.append("title", uploadData.title);
  formData.append("music", uploadData.uri);

  if (uploadData.image) {
    formData.append("image", uploadData.image);
  }

  try {
    await dispatch(createMusic(formData)).unwrap();

    setShowUploadModal(false);
    Swal.fire({
      icon: "success",
      title: "Uploaded!",
      text: "Song uploaded successfully 🎵",
      timer: 1500,
      showConfirmButton: false,
      confirmButtonColor: "#7c3aed",
    });
        setUploadData({ title: "", uri: null, image: null });


  } catch (err) {
    console.error(err);

    setShowUploadModal(false);
    // setUploadData({ title: "", uri: null, image: null });
    Swal.fire({
      icon: "error",
      title: "Upload Failed",
      text: err?.message || "Something went wrong ❌",
      confirmButtonColor: "#ef4444",
    });
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <div className="flex items-start gap-4">
              <MusicalBackButton to="/home" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2 inline-block">
                  Music Library
                </h1>
                <p className="text-purple-600">
                  {activeTab === "my-songs"
                    ? `${musicList.length} of your songs`
                    : `${musicList.length} songs available`}
                </p>
              </div>
            </div>

            {userData.role === "artist" && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all flex items-center gap-2 shadow-md"
              >
                <Upload className="w-5 h-5" />
                Add Song
              </button>
            )}

          </div>
        </div>

        {userData.role === "artist" && (
          <div className="flex gap-4 border-b border-purple-100 mb-6">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-2 flex items-center gap-2 ${activeTab === "all"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500"
                }`}
            >
              <ListMusic className="w-4 h-4" />
              All Songs
            </button>

            <button
              onClick={() => setActiveTab("my-songs")}
              className={`pb-2 flex items-center gap-2 ${activeTab === "my-songs"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500"
                }`}
            >
              <User className="w-4 h-4" />
              My Songs
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-4 border border-purple-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Search songs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

        </div>
      </div>

      <MusicList musicList={filteredMusic} onDelete={true} activeTab={activeTab} loading={loading} />
      {showUploadModal && <SongUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        createLoading={createLoading}
      />}

    </div>
  );
};

export default MusicListPage;