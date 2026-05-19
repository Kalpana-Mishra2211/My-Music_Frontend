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

    const { likeList, loading } = useSelector((store) => store.music);

    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        dispatch(getLikeList());
    }, [dispatch]);

    const handlePlay = (song) => {
        if (currentTrack?._id === song._id) {
            setIsPlaying(!isPlaying);
            return;
        }
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

            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6">

                <div className="block md:hidden space-y-3">
                    {likeList?.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <FaMusic className="text-4xl mx-auto mb-3 text-purple-300" />
                            No liked songs yet
                        </div>
                    ) : (
                        likeList?.map((song, index) => {
                            const isActive = currentTrack?._id === song?._id;

                            return (
                                <div
                                    key={song?._id}
                                    className={`bg-white rounded-2xl p-3 shadow-sm border transition
                        ${isActive ? "border-purple-400 shadow-md" : "border-purple-100"}`}
                                >
                                    <div className="flex gap-3">

                                        <img
                                            src={song?.image || song?.coverImage}
                                            className="w-16 h-16 rounded-xl object-cover"
                                            alt=""
                                        />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-sm text-gray-800 truncate">
                                                        {song?.title}
                                                    </h3>

                                                    <p className="text-xs text-purple-600 truncate">
                                                        {song?.artist?.artistProfile?.stageName}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => handlePlay(song)}
                                                    className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0"
                                                >
                                                    {isActive && isPlaying ? (
                                                        <FaPause className="text-xs" />
                                                    ) : (
                                                        <FaPlay className="text-xs ml-0.5" />
                                                    )}
                                                </button>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[11px] text-gray-400">
                                                        Genre
                                                    </p>

                                                    <p className="text-xs text-gray-700">
                                                        {song?.genre || "N/A"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-[11px] text-gray-400">
                                                        Duration
                                                    </p>

                                                    <p className="text-xs text-gray-700">
                                                        {formatTime(song?.duration)}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        handleRemoveLiked(
                                                            song?._id,
                                                            song?.title
                                                        )
                                                    }
                                                    className="text-pink-500 p-2"
                                                >
                                                    <FaTrash className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-xs text-purple-400 font-semibold border-b border-purple-100">
                                <th className="px-4 py-3 text-left w-16">#</th>
                                <th className="px-4 py-3 text-left">TITLE</th>
                                <th className="px-4 py-3 text-left">ARTIST</th>
                                <th className="px-4 py-3 text-left">GENRE</th>
                                <th className="px-4 py-3 text-right">DURATION</th>
                            </tr>
                        </thead>

                        <tbody>
                            {likeList?.map((song, index) => {
                                const isActive = currentTrack?._id === song?._id;

                                return (
                                    <tr
                                        key={song?._id}
                                        className={`group transition cursor-pointer hover:bg-white hover:shadow-sm border-b border-purple-50
                            ${isActive ? "bg-white shadow-md border-purple-100" : ""}`}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center text-gray-500">
                                                <span className="group-hover:hidden">
                                                    {index + 1}
                                                </span>

                                                <button
                                                    onClick={() => handlePlay(song)}
                                                    className="hidden group-hover:flex text-purple-600"
                                                >
                                                    {isActive && isPlaying ? (
                                                        <FaPause />
                                                    ) : (
                                                        <FaPlay />
                                                    )}
                                                </button>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={song?.image || song?.coverImage}
                                                    className="w-10 h-10 rounded-lg object-cover shadow-sm"
                                                    alt=""
                                                />

                                                <p
                                                    className={`text-sm font-medium ${isActive
                                                            ? "text-purple-700"
                                                            : "text-gray-800"
                                                        }`}
                                                >
                                                    {song?.title}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {song?.artist?.artistProfile?.stageName}
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {song?.genre}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-4">
                                                <span className="text-gray-400 text-sm">
                                                    {formatTime(song?.duration)}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        handleRemoveLiked(
                                                            song?._id,
                                                            song?.title
                                                        )
                                                    }
                                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-pink-500 transition"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {(isPlaying && currentTrack) &&
                <CurrentTrackPlayer
                    currentTrack={currentTrack}
                    musicList={likeList}
                    isPlaying={isPlaying}
                    onTrackChange={setCurrentTrack}

                    onPlayStateChange={setIsPlaying}
                />
            }
        </div>
    );
};

export default LikedSongs;