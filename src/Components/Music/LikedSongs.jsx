import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaHeart,
    FaPlay,
    FaPause,
    FaTrash,
    FaArrowLeft,
    FaMusic,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { getLikeList, toggleLike } from "../../API/music/music";
import CurrentTrackPlayer from "../UI/CurrentTrack";
import { formatTime } from "../../utils/helper";
import MusicalBackButton from "../UI/MusicalBackButton";

const LikedSongs = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { likeList ,loading} = useSelector((store) => store.music);

    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        dispatch(getLikeList());
    }, [dispatch]);

    const handlePlay = (song) => {
        setCurrentTrack(song);
        setIsPlaying(true);
    };

    const handleRemoveLiked = async (songId, songTitle) => {
        const result = await Swal.fire({
            title: "Remove from Liked Songs?",
            text: `"${songTitle}"`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ec4899",
            cancelButtonColor: "#a855f7",
            confirmButtonText: "Remove",
        });

        if (result.isConfirmed) {
            await dispatch(toggleLike(songId)).unwrap()
            Swal.fire({
                icon: "success",
                title: "Removed",
                timer: 1000,
                showConfirmButton: false,
            });
        }
    };

    if (loading) {
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

    return (
        <div className="bg-gradient-to-b from-purple-50 via-pink-50 to-purple-100 pb-32 md:pb-22">
            <div className="bg-gradient-to-r from-purple-100/80 to-pink-100/80 backdrop-blur border-b border-purple-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center gap-3 sm:gap-4">
                    <MusicalBackButton to="/home" />

                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <FaHeart className="text-white text-lg sm:text-xl" />
                    </div>

                    <div>
                        <p className="text-xs text-purple-500 uppercase tracking-wide">
                            Playlist
                        </p>
                        <h1 className="text-xl sm:text-3xl font-bold text-gray-800">
                            Liked Songs
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500">
                            {likeList?.length || 0} songs
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6 overflow-x-auto">
                <div className="min-w-[600px] md:min-w-0">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-xs text-purple-400 font-semibold border-b border-purple-100">
                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left w-12 sm:w-16">#</th>
                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">TITLE</th>
                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left hidden sm:table-cell">ARTIST</th>
                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left hidden md:table-cell">GENRE</th>
                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-right">DURATION</th>
                            </tr>
                        </thead>

                        <tbody>
                            {likeList?.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="text-center py-20 text-gray-500">
                                            <FaMusic className="text-4xl mx-auto mb-3 text-purple-300" />
                                            No liked songs yet
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                likeList?.map((song, index) => {
                                    const isActive = currentTrack?._id === song?._id;

                                    return (
                                        <tr
                                            key={song?._id}
                                            className={`group transition cursor-pointer hover:bg-white hover:shadow-sm border-b border-purple-50
                                            ${isActive ? "bg-white shadow-md border-purple-100" : ""}`}
                                        >
                                            <td className="px-2 sm:px-4 py-2 sm:py-3">
                                                <div className="flex items-center text-gray-500">
                                                    <span className="group-hover:hidden text-sm sm:text-base">
                                                        {index + 1}
                                                    </span>

                                                    <button
                                                        onClick={() => handlePlay(song)}
                                                        className="hidden group-hover:flex text-purple-600"
                                                    >
                                                        {isActive && isPlaying ? (
                                                            <FaPause className="text-xs sm:text-sm" />
                                                        ) : (
                                                            <FaPlay className="text-xs sm:text-sm" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>

                                            <td className="px-2 sm:px-4 py-2 sm:py-3">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <img
                                                        src={song?.image || song?.coverImage}
                                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover shadow-sm"
                                                        alt=""
                                                    />

                                                    <div>
                                                        <p className={`text-xs sm:text-sm font-medium ${
                                                            isActive ? "text-purple-700" : "text-gray-800"
                                                        }`}>
                                                            {song?.title?.length > 20 ? `${song?.title?.substring(0, 20)}...` : song?.title}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-500 hidden sm:table-cell">
                                                {song?.artist?.artistProfile?.stageName?.length > 15 
                                                    ? `${song?.artist?.artistProfile?.stageName?.substring(0, 15)}...` 
                                                    : song?.artist?.artistProfile?.stageName}
                                            </td>

                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                                                {song?.genre}
                                            </td>

                                            <td className="px-2 sm:px-4 py-2 sm:py-3">
                                                <div className="flex items-center justify-end gap-2 sm:gap-4">
                                                    <span className="text-gray-400 text-xs sm:text-sm">
                                                        {formatTime(song?.duration)}
                                                    </span>

                                                    {currentTrack?._id !== song?._id && (
                                                        <button
                                                            onClick={() => handleRemoveLiked(song?._id, song?.title)}
                                                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-pink-500 transition"
                                                        >
                                                            <FaTrash className="text-xs sm:text-sm" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {(isPlaying && currentTrack) &&
                <CurrentTrackPlayer
                    currentTrack={currentTrack}
                    musicList={likeList}
                    isPlaying={isPlaying}
                    onTrackChange={(track) => {
                        setCurrentTrack(track);
                        setIsPlaying(true);
                    }}
                    onPlayStateChange={setIsPlaying}
                />
            }
        </div>
    );
};

export default LikedSongs;