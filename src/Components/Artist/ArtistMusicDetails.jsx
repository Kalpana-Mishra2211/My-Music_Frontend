import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    FaArrowLeft,
    FaUsers,
    FaMusic,
    FaPlay,
    FaRandom,
    FaInstagram,
    FaYoutube,
    FaTwitter,
    FaChevronLeft,
    FaChevronRight,
    FaHeadphones,
    FaHeart,
} from "react-icons/fa";
import MusicList from "../UI/MusicList";

import {
    getMusicByArtistId,
    getArtistDetails,
    toggleFollowArtist,
} from "../../API/artist/artist";

import { useDispatch, useSelector } from "react-redux";
import MusicalBackButton from "../UI/MusicalBackButton";

function ArtistMusicDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    const [page, setPage] = useState(1);

    const limit = 10;

    const {
        artistDetails,
        musicList,
        pagination,
        loading,
        musicLoading,

    } = useSelector((store) => store.artist);

    useEffect(() => {
        if (id) {
            dispatch(getArtistDetails(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (id) {
            dispatch(
                getMusicByArtistId({
                    id,
                    page,
                    limit,
                    search: "",
                })
            );
        }
    }, [dispatch, id, page]);

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

       const handlePlayAll = () => {
        if (playListById?.musics && playListById?.musics.length > 0) {
            setCurrentTrack(playListById?.musics[0]);
            setIsPlaying(true);
        }
    };


    const handlePrevPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
            window.scrollTo({ top: 550, behavior: 'smooth' });
        }
    };

    const handleNextPage = () => {
        if (page < pagination?.totalPages) {
            setPage((prev) => prev + 1);
            window.scrollTo({ top: 550, behavior: 'smooth' });
        }
    };

    const handleFollow = (id) => {
        dispatch(toggleFollowArtist(id));
    };
    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    };

    if (!artistDetails) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-white flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const artistProfile = artistDetails;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-white">

            <div className="relative h-[280px] md:h-[320px] overflow-hidden">

                <div
                    className="absolute inset-0 bg-cover bg-center scale-105 blur-2xl opacity-20"
                    style={{
                        backgroundImage: `url(${artistProfile?.profileImage})`,
                    }}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-purple-200/50 via-purple-100/30 to-transparent" />
<div className="m-3">
     <MusicalBackButton to="/home" />
</div>


                <div className="relative z-10 h-full flex items-center px-6 md:px-12">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-5 md:gap-6">

                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-purple-300 blur-xl opacity-40"></div>
                            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-xl ring-4 ring-white">
                                <img
                                    src={artistProfile?.profileImage}
                                    alt={artistProfile?.stageName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-0.5 bg-purple-500 rounded-full"></div>
                                <p className="text-xs uppercase tracking-wider text-purple-700 font-semibold">Artist</p>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent mb-3">
                                {artistProfile?.stageName}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                                    <FaUsers size={12} className="text-purple-600" />
                                    <span className="text-gray-700">{formatNumber(artistProfile?.followersCount || 0)} followers</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-purple-300"></div>
                                <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                                    <FaMusic size={12} className="text-purple-600" />
                                    <span className="text-gray-700">{artistProfile?.totalSongs || 0} songs</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-purple-300"></div>
                                <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                                    <FaHeadphones size={12} className="text-purple-600" />
                                    <span className="text-gray-700">{artistProfile?.totalAlbums || 0} albums</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">

                <div className="flex items-center gap-4 mb-6">
                    {/* <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-2.5 rounded-full text-sm font-semibold transition flex items-center gap-2 shadow-md">
                        <FaPlay size={12} />
                        Play All
                    </button> */}
                  
                  { userData.id !== id && <button
                        onClick={() => {
                            handleFollow(id)
                        }}
                        className={`px-6 py-2.5 rounded-full text-sm font-semibold transition flex items-center gap-2 ${artistProfile?.isFollowing
                                ? "bg-white/80 text-gray-600 border border-purple-200"
                                : "bg-white/80 text-gray-700 border border-purple-200 hover:bg-white hover:shadow-sm"
                            }`}
                    >
                        <FaHeart className={`${artistProfile?.isFollowing ? "text-red-500" : "text-gray-400"} text-sm`} />
                        {artistProfile?.isFollowing ? "Following" : "Follow"}
                    </button>}
                </div>

                <div className="mb-8 pb-6 border-b border-purple-200/50">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                            <h2 className="text-sm uppercase tracking-wider text-purple-600 font-semibold">About</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm bg-transparent">
                            {artistProfile?.bio || "No bio available for this artist."}
                        </p>

                        {artistProfile?.genre?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {artistProfile?.genre.map((item, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 rounded-full bg-white/40 backdrop-blur-sm text-purple-700 text-xs font-medium border border-purple-200 hover:bg-white/60 transition"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        )}

                        {(artistProfile?.socialLinks?.instagram ||
                            artistProfile?.socialLinks?.youtube ||
                            artistProfile?.socialLinks?.twitter) && (
                                <div className="flex gap-3 mt-4">
                                    {artistProfile?.socialLinks?.instagram && (
                                        <a
                                            href={`https://instagram.com/${artistProfile?.socialLinks.instagram}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-8 h-8 rounded-full bg-white/40 backdrop-blur-sm hover:bg-white border border-purple-200 flex items-center justify-center text-gray-500 hover:text-pink-500 transition"
                                        >
                                            <FaInstagram size={14} />
                                        </a>
                                    )}
                                    {artistProfile?.socialLinks?.youtube && (
                                        <a
                                            href={`https://youtube.com/${artistProfile?.socialLinks.youtube}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-8 h-8 rounded-full bg-white/40 backdrop-blur-sm hover:bg-white border border-purple-200 flex items-center justify-center text-gray-500 hover:text-red-600 transition"
                                        >
                                            <FaYoutube size={14} />
                                        </a>
                                    )}
                                    {artistProfile?.socialLinks?.twitter && (
                                        <a
                                            href={`https://twitter.com/${artistProfile?.socialLinks.twitter}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-8 h-8 rounded-full bg-white/40 backdrop-blur-sm hover:bg-white border border-purple-200 flex items-center justify-center text-gray-500 hover:text-blue-500 transition"
                                        >
                                            <FaTwitter size={14} />
                                        </a>
                                    )}
                                </div>
                            )}
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <FaHeadphones className="text-purple-500 text-sm" />
                                <h2 className="text-xl font-bold text-gray-800">Popular Songs</h2>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {pagination?.total || 0} tracks available
                            </p>

                    </div>

                    {musicLoading ? (
                        <div className="flex justify-center py-12 bg-white/40 backdrop-blur-sm rounded-xl">
                            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <MusicList
                            musicList={musicList}
                            favorite={false}
                            like={false}
                            loading={false}
                            onDelete={null}
                        />
                    )}

                    {pagination?.totalPages > 1 && (
                        <>
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={page === 1}
                                    className="w-8 h-8 rounded-full bg-white/80 hover:bg-white disabled:opacity-40 flex items-center justify-center transition text-gray-600 border border-purple-200"
                                >
                                    <FaChevronLeft size={12} />
                                </button>

                                <span className="text-xs text-gray-600 mx-3 font-medium">
                                    {page} / {pagination?.totalPages}
                                </span>

                                <button
                                    onClick={handleNextPage}
                                    disabled={page === pagination?.totalPages}
                                    className="w-8 h-8 rounded-full bg-white/80 hover:bg-white disabled:opacity-40 flex items-center justify-center transition text-gray-600 border border-purple-200"
                                >
                                    <FaChevronRight size={12} />
                                </button>
                            </div>

                            <div className="text-center mt-3">
                                <p className="text-xs text-gray-500">
                                    Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, pagination?.total || 0)} of {pagination?.total || 0} songs
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ArtistMusicDetails;