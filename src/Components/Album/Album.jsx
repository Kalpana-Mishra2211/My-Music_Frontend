import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Plus,
    Search,
    X,
    Play,
    Music,
    Calendar,
    Trash2,
    Filter,
    ChevronDown,
    ChevronUp,
    Heart,
    Clock,
    User,
    ListMusic,
    Disc,
    ArrowRight,
    ListMusicIcon,
    Edit,
    Edit2,
    Edit2Icon
} from "lucide-react";
import CreateAlbumModal from "./CreateAlbumModal";
import { getAlbumList, deleteAlbum } from "../../API/album/album";
import Swal from "sweetalert2";
import { getTotalDuration } from "../../utils/helper";
import MusicalBackButton from "../UI/MusicalBackButton";
import { handleDelete } from "../../utils/handleDelete";

function AlbumList() {
    const navigate = useNavigate();
    const [filteredAlbums, setFilteredAlbums] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const dispatch = useDispatch();
    const { albumList, albumLoading } = useSelector((store) => store.album);
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    const [activeTab, setActiveTab] = useState("all");


    useEffect(() => {
        if (activeTab === "my-albums") {
            dispatch(getAlbumList(userData.id));
        }
        else {
            dispatch(getAlbumList());
        }
    }, [dispatch, activeTab]);


    useEffect(() => {
        if (albumList && albumList.length > 0) {
            let result = [...albumList];

            if (searchTerm) {
                result = result.filter(album =>
                    album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (album.artist?.userName || album.artist?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            switch (sortBy) {
                case "newest":
                    result.sort((a, b) => new Date(b.createdAt || b.releaseDate) - new Date(a.createdAt || a.releaseDate));
                    break;
                case "oldest":
                    result.sort((a, b) => new Date(a.createdAt || a.releaseDate) - new Date(b.createdAt || b.releaseDate));
                    break;
                case "a-z":
                    result.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case "z-a":
                    result.sort((a, b) => b.title.localeCompare(a.title));
                    break;
                case "most-songs":
                    result.sort((a, b) => (b.musics?.length || 0) - (a.musics?.length || 0));
                    break;
                default:
                    break;
            }

            setFilteredAlbums(result);
        } else {
            setFilteredAlbums([]);
        }
    }, [albumList, searchTerm, sortBy]);

    const handleDeleteAlbum = (id, e) => {
        e.stopPropagation();
        handleDelete({
            dispatch,
            id,
            action: deleteAlbum,
            title: "Delete Album?",
            text: "This album will be permanently deleted!",
            successText: "Album has been deleted successfully.",
        });
    };

    const handleAlbumClick = (album) => {
        navigate(`/album/${album._id}`);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSortBy("newest");
    };

    const refreshAlbums = () => {
        dispatch(getAlbumList());
    };
    const handleEditAlbum = (album, e) => {
        e.stopPropagation();
        setSelectedAlbum(album);
        setShowCreateModal(true);
    };
    const getArtistName = (album) => {
        if (album.artist?.userName) return album.artist.userName;
        if (album.artist?.name) return album.artist.name;
        if (typeof album.artist === 'string') return "Artist";
        return "Unknown Artist";
    };

    const getSongCount = (album) => {
        return album.musics?.length || 0;
    };

    const getReleaseYear = (album) => {
        if (album.releaseDate) return new Date(album.releaseDate).getFullYear();
        if (album.createdAt) return new Date(album.createdAt).getFullYear();
        return "N/A";
    };

    if (albumLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-purple-600 font-medium">Loading amazing albums...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-200">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4 flex-wrap gap-4">

                        <div className="flex items-start gap-4">
                            <MusicalBackButton to="/home" />
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
                                    Album Collection
                                </h1>
                                <p className="text-purple-600">
                                    Discover {filteredAlbums.length} amazing albums from various artists
                                </p>
                            </div>
                        </div>

                        {user?.role === "artist" && token && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all flex items-center gap-2 shadow-md"
                            >
                                <Plus className="w-5 h-5" />
                                Create New Album
                            </button>
                        )}
                    </div>
                </div>

                {user?.role === "artist" && (
                    <div className="flex gap-4 border-b border-purple-100 mb-6">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`pb-2 flex items-center gap-2 ${activeTab === "all"
                                ? "text-purple-600 border-b-2 border-purple-600"
                                : "text-gray-500"
                                }`}
                        >
                            <ListMusicIcon className="w-4 h-4" />
                            All Albums
                        </button>

                        <button
                            onClick={() => setActiveTab("my-albums")}
                            className={`pb-2 flex items-center gap-2 ${activeTab === "my-albums"
                                ? "text-purple-600 border-b-2 border-purple-600"
                                : "text-gray-500"
                                }`}
                        >
                            <User className="w-4 h-4" />
                            My Albums
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-md p-4 mb-8 border border-purple-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                        <input
                            type="text"
                            placeholder="Search by album or artist..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {
                    filteredAlbums.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl shadow-md border border-purple-100">
                            <div className="text-6xl mb-4">🎵</div>
                            <h3 className="text-xl font-semibold text-purple-700 mb-2">No albums found</h3>
                            <p className="text-purple-500 mb-4">
                                {albumList?.length === 0 ? "No albums created yet" : "Try adjusting your search"}
                            </p>
                            {user?.role === "artist" && albumList?.length === 0 && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all flex items-center gap-2 mx-auto"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create Your First Album
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredAlbums.map((album) => (
                                    <div
                                        key={album._id}
                                        onClick={() => handleAlbumClick(album)}
                                        className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-purple-100"
                                    >
                                        <div className="relative overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200 aspect-square">
                                            <img
                                                src={album.image || "https://picsum.photos/id/104/300/300"}
                                                alt={album.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.src = "https://picsum.photos/id/104/300/300";
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-purple-900 opacity-0 group-hover:opacity-60 transition-opacity flex items-center justify-center">
                                                <div className="bg-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
                                                    <Play className="w-8 h-8 text-purple-600 ml-0.5" />
                                                </div>
                                            </div>

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                                <span className="bg-white/90 backdrop-blur-sm text-purple-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                                    View Details <ArrowRight className="w-3 h-3" />
                                                </span>
                                            </div>


                                            <div className="absolute bottom-2 left-2">
                                                <span className="px-2 py-1 bg-purple-600/90 backdrop-blur-sm text-white text-xs rounded-lg flex items-center gap-1">
                                                    <Music className="w-3 h-3" />
                                                    {getSongCount(album)} songs
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-lg text-gray-800 truncate group-hover:text-purple-600 transition-colors">
                                                        {album.title}
                                                    </h3>
                                                    <p className="text-purple-500 text-sm mb-2 font-medium">
                                                        {album.description}

                                                    </p>
                                                </div>

                                                {user?.role === "artist" && activeTab === "my-albums" && (
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={(e) => handleEditAlbum(album._id, e)}
                                                            className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                            title="Edit Album"
                                                        >
                                                            <Edit2Icon size={16} className="text-blue-400" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDeleteAlbum(album._id, e)}
                                                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                            title="Delete Album"
                                                        >
                                                            <Trash2 size={16} className="text-red-400" />                            </button>
                                                    </div>
                                                )}
                                            </div>
               
                                        </div>
                                    </div>
                                ))}
                            </div>


                        </>
                    )}
            </div>

            {showCreateModal && (
                <CreateAlbumModal
                    isOpen={showCreateModal}
                    onClose={() => {
                        setShowCreateModal(false);
                        setSelectedAlbum(null);
                    }}
                    onAlbumCreated={refreshAlbums}
                    id={selectedAlbum}
                />
            )}
        </div>
    );
}

export default AlbumList;