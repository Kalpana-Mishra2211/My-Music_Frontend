import React, { useState, useEffect } from "react";
import {
    X,
    User,
    Camera,
    Save,
    Loader2,
    Music,
    Heart,
    Phone,
    Users,
    Album,
    Edit2,
    Plus,
    Trash2,
    Globe,
    Clock,
    Search,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from "react-redux";
import { getArtistProfile, updateArtistProfile } from "../../API/artist/artist";
import { FaInstagram } from "react-icons/fa";
import { BsSpotify, BsTwitterX, BsYoutube } from "react-icons/bs";

const genresList = [
    "Pop", "Rock", "Hip Hop", "R&B", "Electronic", "Jazz", "Classical",
    "Country", "Folk", "Metal", "Punk", "Indie", "Alternative", "Blues",
    "Reggae", "Latin", "K-Pop", "Afrobeat", "Ambient", "Experimental"
];

const ArtistProfileModal = ({ isOpen, onClose, user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newGenre, setNewGenre] = useState("");
    const [genreSearch, setGenreSearch] = useState("");
    const [profileLoading, setProfileLoading] = useState(false);
    const [showGenreDropdown, setShowGenreDropdown] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [profileData, setProfileData] = useState({
        stageName: "",
        bio: "",
        genre: [],
        profileImage: null,
        profileImageFile: null,
        profileImagePreview: "",
        socialLinks: {
            instagram: "",
            youtube: "",
            spotify: "",
            twitter: "",
        },
        phoneNumber: "",
    });

    const dispatch = useDispatch();
    const { loading, profile } = useSelector((store) => store.artist || {});

    useEffect(() => {
        dispatch(getArtistProfile());
    }, [dispatch]);

    const [stats, setStats] = useState({
        totalSongs: 0,
        totalAlbums: 0,
    });

    useEffect(() => {
        if (profile && isOpen) {
            const artistProfile = profile?.artistProfile || {};
            setProfileData({
                stageName: artistProfile?.stageName || user?.userName || "",
                bio: artistProfile?.bio || "",
                genre: artistProfile?.genre || [],
                profileImage: artistProfile?.profileImage,
                profileImageFile: null,
                profileImagePreview: "",
                socialLinks: {
                    instagram: artistProfile?.socialLinks?.instagram || "",
                    youtube: artistProfile?.socialLinks?.youtube || "",
                    spotify: artistProfile?.socialLinks?.spotify || "",
                    twitter: artistProfile?.socialLinks?.twitter || "",
                },
                phoneNumber: artistProfile?.phoneNumber || "",
            });

            setStats({
                totalSongs: artistProfile?.totalSongs || 0,
                totalAlbums: artistProfile?.totalAlbums || 0,
            });
        }
    }, [profile, isOpen, user]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewURL = URL.createObjectURL(file);
            setProfileData((prev) => ({
                ...prev,
                profileImageFile: file,
                profileImagePreview: previewURL,
            }));
        }
    };

    const filteredGenres = genresList.filter(genre =>
        genre.toLowerCase().includes(genreSearch.toLowerCase()) &&
        !profileData.genre.includes(genre)
    );

    const handleAddGenre = (genre) => {
        if (genre && !profileData.genre.includes(genre)) {
            setProfileData({
                ...profileData,
                genre: [...profileData.genre, genre]
            });
            setNewGenre("");
            setGenreSearch("");
            setShowGenreDropdown(false);
        }
    };

    const handleRemoveGenre = (genreToRemove) => {
        setProfileData({
            ...profileData,
            genre: profileData.genre.filter(g => g !== genreToRemove)
        });
    };

    const handleSocialLinkChange = (platform, value) => {
        setProfileData({
            ...profileData,
            socialLinks: {
                ...profileData.socialLinks,
                [platform]: value
            }
        });
    };

    const handleProfileUpdate = async () => {
        if (!profileData.stageName) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Stage name is required",
                timer: 2000,
            });
            return;
        }

        if (!profileData.phoneNumber) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Phone number is required",
                timer: 2000,
            });
            return;
        }
        setProfileLoading(true);
        try {
            const formData = new FormData();
            formData.append("stageName", profileData.stageName);
            formData.append("bio", profileData.bio || "");
            formData.append("phoneNumber", profileData.phoneNumber);
            profileData.genre.forEach((g) => formData.append("genre", g));
            formData.append("socialLinks", JSON.stringify(profileData.socialLinks));
            if (profileData.profileImageFile instanceof File) {
                formData.append("profileImage", profileData.profileImageFile);
            }
            const res = await dispatch(updateArtistProfile(formData)).unwrap();
            setShowSuccessModal(true);
            setIsEditing(false);

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: error.message || "Something went wrong",
            });
        } finally {
            setProfileLoading(false);
        }
    };

    const SuccessModal = () => {
        if (!showSuccessModal) return null;

        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000] p-4">
                <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden animate-fade-in">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-white rounded-full p-1">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">Profile Update Submitted!</h2>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="text-center mb-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Thank You!</h3>
                            <p className="text-sm text-gray-500">Your profile update has been submitted successfully.</p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-blue-800 mb-1">What happens next?</p>
                                    <ul className="text-xs text-blue-700 space-y-1">
                                        <li>• Admin will review your changes</li>
                                        <li>• You'll receive a notification once approved</li>
                                        <li>• Your profile will be updated automatically</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 rounded-lg p-3 mb-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-yellow-700">Current Status:</span>
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                    <Clock className="w-3 h-3" />
                                    Pending Approval
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    onClose();
                                    setTimeout(() => window.location.reload(), 500);
                                }}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4"
                onClick={() => {
                    onClose();
                    setIsEditing(false);
                }}
            >
                <div
                    className="bg-white rounded-2xl max-w-3xl w-full shadow-xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Artist Profile
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            {user?.artistStatus === "pending" && (
                                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Pending Approval
                                </span>
                            )}
                            {user?.artistStatus === "approved" && (
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    ✓ Approved
                                </span>
                            )}
                            {user?.artistStatus === "rejected" && (
                                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    ✗ Rejected
                                </span>
                            )}
                            <button
                                onClick={() => {
                                    onClose();
                                    setIsEditing(false);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Profile Image Section - Fixed positioning */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                                    {profileData.profileImagePreview || profileData.profileImage ? (
                                        <img
                                            src={profileData.profileImagePreview || profileData.profileImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-4xl">
                                            {profileData.stageName?.[0]?.toUpperCase() || "A"}
                                        </div>
                                    )}
                                </div>
                                {isEditing && (
                                    <label className="absolute bottom-1 right-1 bg-purple-600 rounded-full p-2 cursor-pointer hover:bg-purple-700 transition-colors shadow-lg z-20">
                                        <Camera className="w-4 h-4 text-white" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                                    <User className="w-4 h-4 text-purple-600" />
                                    Stage Name <span className="text-red-500">*</span>
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.stageName}
                                        onChange={(e) => setProfileData({ ...profileData, stageName: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter stage name"
                                    />
                                ) : (
                                    <p className="text-gray-800 font-medium">{profileData.stageName || "N/A"}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-purple-600" />
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={profileData.phoneNumber}
                                        onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter phone number"
                                    />
                                ) : (
                                    <p className="text-gray-800">{profileData.phoneNumber || "N/A"}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                                    <Edit2 className="w-4 h-4 text-purple-600" />
                                    Bio
                                </label>
                                {isEditing ? (
                                    <textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        rows="4"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Tell your story as an artist..."
                                    />
                                ) : (
                                    <p className="text-gray-600 leading-relaxed">{profileData.bio || "No bio added yet"}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                                    <Music className="w-4 h-4 text-purple-600" />
                                    Genres
                                </label>
                                {isEditing ? (
                                    <div>
                                        <div className="relative mb-2">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={genreSearch}
                                                    onChange={(e) => {
                                                        setGenreSearch(e.target.value);
                                                        setShowGenreDropdown(true);
                                                    }}
                                                    onClick={() => setShowGenreDropdown((prev) => !prev)}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    placeholder="Search or add genre..."
                                                />
                                            </div>
                                            {showGenreDropdown && filteredGenres.length > 0 && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                    {filteredGenres.map((genre) => (
                                                        <button
                                                            key={genre}
                                                            type="button"
                                                            onClick={() => handleAddGenre(genre)}
                                                            className="w-full text-left px-4 py-2 hover:bg-purple-50 text-gray-700 transition-colors"
                                                        >
                                                            {genre}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {genreSearch && !genresList.includes(genreSearch) && (
                                            <button
                                                onClick={() => handleAddGenre(genreSearch)}
                                                className="mb-2 text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                                            >
                                                <Plus className="w-3 h-3" />
                                                Add "{genreSearch}" as new genre
                                            </button>
                                        )}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {profileData.genre.map((genre, index) => (
                                                <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                                    {genre}
                                                    <button onClick={() => handleRemoveGenre(genre)} className="hover:text-red-600 transition">
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {profileData.genre.length > 0 ? (
                                            profileData.genre.map((genre, index) => (
                                                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                                    {genre}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No genres added</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-purple-600" />
                                    Social Links
                                </label>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <FaInstagram className="w-5 h-5 text-pink-500" />
                                        {isEditing ? (
                                            <input
                                                type="url"
                                                value={profileData.socialLinks.instagram}
                                                onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="Instagram URL"
                                            />
                                        ) : (
                                            profileData.socialLinks.instagram ? (
                                                <a
                                                    href={`https://instagram.com/${profileData.socialLinks.instagram.replace("@", "")}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline flex-1 truncate"
                                                >
                                                    {profileData.socialLinks.instagram}
                                                </a>
                                            ) : (
                                                <p className="text-gray-500 flex-1">Not added</p>
                                            )
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <BsYoutube className="w-5 h-5 text-red-500" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={profileData.socialLinks.youtube}
                                                onChange={(e) => handleSocialLinkChange("youtube", e.target.value)}
                                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="YouTube username"
                                            />
                                        ) : (
                                            profileData.socialLinks.youtube ? (
                                                <a
                                                    href={`https://youtube.com/@${profileData.socialLinks.youtube.replace("@", "")}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline flex-1 truncate"
                                                >
                                                    {profileData.socialLinks.youtube}
                                                </a>
                                            ) : (
                                                <p className="text-gray-500 flex-1">Not added</p>
                                            )
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <BsTwitterX className="w-5 h-5 text-gray-600" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={profileData.socialLinks.twitter}
                                                onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="Twitter/X username"
                                            />
                                        ) : (
                                            profileData.socialLinks.twitter ? (
                                                <a
                                                    href={`https://x.com/${profileData.socialLinks.twitter.replace("@", "")}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline flex-1 truncate"
                                                >
                                                    {profileData.socialLinks.twitter}
                                                </a>
                                            ) : (
                                                <p className="text-gray-500 flex-1">Not added</p>
                                            )
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <BsSpotify className="w-5 h-5 text-green-500" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={profileData.socialLinks.spotify}
                                                onChange={(e) => handleSocialLinkChange("spotify", e.target.value)}
                                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="Spotify username"
                                            />
                                        ) : (
                                            profileData.socialLinks.spotify ? (
                                                <a
                                                    href={`https://open.spotify.com/user/${profileData.socialLinks.spotify}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline flex-1 truncate"
                                                >
                                                    {profileData.socialLinks.spotify}
                                                </a>
                                            ) : (
                                                <p className="text-gray-500 flex-1">Not added</p>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mt-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Artist Statistics</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <Music className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                                        <p className="text-xl font-bold text-gray-800">{stats.totalSongs.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500">Total Songs</p>
                                    </div>
                                    <div className="text-center">
                                        <Album className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                                        <p className="text-xl font-bold text-gray-800">{stats.totalAlbums.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500">Total Albums</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleProfileUpdate}
                                            disabled={profileLoading}
                                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {profileLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                const artistProfile = profile?.artistProfile || {};
                                                setProfileData({
                                                    stageName: artistProfile?.stageName || user?.userName || "",
                                                    bio: artistProfile?.bio || "",
                                                    genre: artistProfile?.genre || [],
                                                    profileImage: artistProfile?.profileImage,
                                                    profileImageFile: null,
                                                    profileImagePreview: "",
                                                    socialLinks: {
                                                        instagram: artistProfile?.socialLinks?.instagram || "",
                                                        youtube: artistProfile?.socialLinks?.youtube || "",
                                                        spotify: artistProfile?.socialLinks?.spotify || "",
                                                        twitter: artistProfile?.socialLinks?.twitter || "",
                                                    },
                                                    phoneNumber: artistProfile?.phoneNumber || "",
                                                });
                                            }}
                                            className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SuccessModal />
        </>
    );
};

export default ArtistProfileModal;