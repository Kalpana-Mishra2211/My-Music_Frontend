import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Play,
    Pause,
    Clock,
    Music,
    ArrowLeft,
    Heart,
    ListMusic,
    User,
    Calendar,
    MoreVertical,
    Share2,
    Trash2,
    AlertCircle
} from "lucide-react";
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from "react-redux";
import { getPlayList, getPlayListById } from "../../API/playList/playlist";
import CurrentTrackPlayer from "../UI/CurrentTrack";
import { formatDate, formatDuration, getTotalDuration } from "../../utils/helper";
import MusicalBackButton from "../UI/MusicalBackButton";

const PlaylistDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [user, setUser] = useState(null);

    const { playListById, loading } = useSelector((store) => store.playlist)
    useEffect(() => {
        if (id) {

            dispatch(getPlayListById(id));
        }
    }, [dispatch, id]);

    const handlePlaySong = (song) => {
        if (currentTrack?._id === song._id) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentTrack(song);
            setIsPlaying(true);
        }
    };

    const handlePlayAll = () => {
        if (playListById?.musics && playListById?.musics.length > 0) {
            setCurrentTrack(playListById?.musics[0]);
            setIsPlaying(true);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-purple-600 font-medium">Loading playListById?...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!playListById) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                            <AlertCircle className="w-12 h-12 text-red-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Playlist not found
                        </h3>
                        <button
                            onClick={() => navigate("/my-playlists")}
                            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                        >
                            Back to Playlists
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <div className="container mx-auto px-12 py-6">
                <MusicalBackButton to="/playlist" label="Back to PlayList" />

            </div>

            <div className="container mx-auto px-4 max-w-7xl mb-8">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                            {playListById?.image || playListById?.musics[0].image ? (
                                <img
                                    src={playListById?.image || playListById?.musics[0].image}
                                    alt={playListById?.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Music className="w-32 h-32 text-purple-400" />
                            )}
                        </div>

                        <div className="flex-1 p-8">
                            <div className="flex items-center gap-2 mb-2">
                                <ListMusic className="w-5 h-5 text-purple-600" />
                                <span className="text-sm font-semibold text-purple-600 uppercase">Playlist</span>
                            </div>

                            <h1 className="text-4xl font-bold text-gray-800 mb-4">{playListById?.title}</h1>

                            {playListById?.description && (
                                <p className="text-gray-600 mb-6">{playListById?.description}</p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                                <div className="flex items-center gap-1">
                                    <Music className="w-4 h-4" />
                                    <span>{playListById?.musics?.length || 0} songs</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{getTotalDuration(playListById)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(playListById?.createdAt)}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handlePlayAll}
                                    disabled={!playListById?.musics?.length}
                                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Play className="w-4 h-4" />
                                    Play All
                                </button>


                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl pb-32">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 w-16">#</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Title</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Artist</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Genre</th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 w-24">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-500" />
                                            <span>Duration</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {playListById?.musics?.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <Music className="w-12 h-12 text-gray-300" />
                                                <p>No songs in this playlist yet</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    playListById?.musics?.map((song, index) => {
                                        const isCurrentlyPlaying = currentTrack?._id === song._id && isPlaying;

                                        return (
                                            <tr
                                                key={song._id}
                                                className={`hover:bg-purple-50 transition-colors cursor-pointer group ${isCurrentlyPlaying ? 'bg-purple-50' : ''
                                                    }`}
                                                onClick={() => handlePlaySong(song)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center w-6">
                                                        {isCurrentlyPlaying ? (
                                                            <div className="flex gap-0.5 items-end">
                                                                <div className="w-1 h-4 bg-purple-600 animate-pulse delay-75"></div>
                                                                <div className="w-1 h-2 bg-purple-600 animate-pulse delay-150"></div>
                                                                <div className="w-1 h-3 bg-purple-600 animate-pulse"></div>
                                                                <div className="w-1 h-4 bg-purple-600 animate-pulse delay-75"></div>
                                                                <div className="w-1 h-2 bg-purple-600 animate-pulse delay-150"></div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 group-hover:text-purple-600">
                                                                {index + 1}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={song.image || `https://picsum.photos/id/${index + 1}/40/40`}
                                                            alt={song.title}
                                                            className="w-10 h-10 rounded object-cover"
                                                        />
                                                        <div>
                                                            <p className={`font-semibold ${isCurrentlyPlaying ? 'text-purple-600' : 'text-gray-800'}`}>
                                                                {song.title}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {song.artist?.artistProfile?.stageName || "Unknown Artist"}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {song.genre}
                                                </td>
                                                <td className="px-6 py-4 text-gray-400">
                                                    {formatDuration(song.duration)}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {currentTrack && (
                <CurrentTrackPlayer
                    currentTrack={currentTrack}
                    musicList={playListById?.musics}
                    onTrackChange={setCurrentTrack}
                    isPlaying={isPlaying}
                    onPlayStateChange={setIsPlaying}
                />
            )}
        </div>
    );
}

export default PlaylistDetail;