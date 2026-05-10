import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, Play, Share2, Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getFavoriteList } from "../../API/music/music";
import MusicCard from "../UI/MusicList";
import MusicList from "../UI/MusicList";
import MusicalBackButton from "../UI/MusicalBackButton";

function FavoriteMusics() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { favList, loading } = useSelector((store) => store.music)

    useEffect(() => {
        dispatch(getFavoriteList())
    }, [dispatch])

    const [hoveredId, setHoveredId] = useState(null);

    const handleToggle = (musicId) => {
        setFavorites((prev) =>
            prev.filter((music) => music?._id !== musicId)
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-red-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-10">
                    <div className="flex items-center justify-between flex-wrap gap-4">

                        <div className="flex items-center gap-4">
                            <MusicalBackButton to="/home" />


                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-3">
                                    <span className="text-red-500 text-2xl sm:text-3xl">❤️</span>
                                    Favorite Songs
                                </h1>

                                <p className="mt-2 text-gray-500 text-sm sm:text-base">
                                    {favList.length === 0
                                        ? "No favorites yet"
                                        : `You have ${favList.length} ${favList.length === 1 ? "song" : "songs"
                                        } in your favorites`}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                <MusicList
                    favorite={true}
                    musicList={favList}
                    loading={loading}
                />

            </div>


        </div>
    );
}

export default FavoriteMusics;