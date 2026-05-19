import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
    Music,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Heart,
    ArrowLeft,
    Clock,
    User,
    Calendar,
    ListMusic,
    Disc
} from "lucide-react";
import { getMusicByAlbum } from "../../API/album/album";
import MusicList from "../UI/MusicList";
import { formatDate, getTotalDuration } from "../../utils/helper";
import MusicalBackButton from "../UI/MusicalBackButton";

const AlbumDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { albumMusicsList, loading } = useSelector((store) => store.album);
    const [likedSongs, setLikedSongs] = useState([]);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioElement, setAudioElement] = useState(null);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showPlayer, setShowPlayer] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(getMusicByAlbum(id))
        }
    }, [dispatch, id])


    const album = albumMusicsList


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-purple-600 font-medium">Loading album details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!album) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <MusicalBackButton to="/albums" />
                    <div className="text-center py-16 bg-white rounded-xl shadow-md border border-purple-100">
                        <div className="text-6xl mb-4">🎵</div>
                        <h3 className="text-xl font-semibold text-purple-700 mb-2">Album not found</h3>
                        <p className="text-purple-500">The album you're looking for doesn't exist</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 pb-32">
  <div className="max-w-7xl mx-auto px-6 py-8">
    <div className="relative mb-8">
      <div className="absolute -top-2 left-0 z-10">
        <MusicalBackButton to="/albums" />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-end pt-12">
  <img
    src={album.image || "https://picsum.photos/id/104/100/100"}
    alt={album.title}
    className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover shadow-xl ring-4 ring-white/50"
  />

  <div className="text-center md:text-left">
    <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-purple-100 rounded-full">
      <Disc className="w-4 h-4 text-purple-600" />
      <span className="text-xs font-medium text-purple-700">Album</span>
    </div>

    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
      {album.title}
    </h1>

    <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-500">
      
      <span className="flex items-center gap-1">
        <span className="font-semibold text-gray-700">
          {album.musics?.length || 0}
        </span>
        tracks
      </span>

      <span className="flex items-center gap-1">
        <span className="font-semibold text-gray-700">
          {getTotalDuration(album)}
        </span>
      </span>

      <span className="flex items-center gap-1">
        <span className="font-semibold text-gray-700">
          {formatDate(album.createdAt)}
        </span>
      </span>

    </div>
  </div>
</div>
    </div>

    <div className="mt-8">
      <MusicList musicList={albumMusicsList.musics} favorite={false} like={false}/>
    </div>
  </div>
</div>
    );
};

export default AlbumDetail;