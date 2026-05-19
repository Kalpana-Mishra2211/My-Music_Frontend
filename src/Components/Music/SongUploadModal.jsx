import React, { useEffect, useState } from "react";
import {
    X,
    Upload,
    Music,
    FileAudio,
    Image,
    Trash2,
    AlertCircle,
    CheckCircle,
    Loader2,
    ChevronDown,
    Tag
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Swal from 'sweetalert2';
import { createMusic, getGenreList } from "../../API/music/music";

const SongUploadModal = ({ isOpen, onClose, createLoading }) => {
    const [uploadData, setUploadData] = useState({
        title: "",
        genre: "",
        uri: null,
        image: null
    });
    const dispatch = useDispatch();
    const { genreList } = useSelector((store) => store.music);
    const [error, setError] = useState({})
    useEffect(() => {
        if (isOpen) {
            dispatch(getGenreList());
        }
    }, [isOpen, dispatch]);
console.log("hello")
    const handleFileChange = (fieldName, maxSizeMB, allowedTypes) => (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setError(prev => ({
            ...prev,
            [fieldName]: ""
        }))
        if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {

            setError(prev => ({
                ...prev,
                [fieldName]: `File size must be less than ${maxSizeMB}MB`
            }))
            return;
        }

        if (allowedTypes && allowedTypes.length > 0) {
            const fileType = file.type;
            const isValidType = allowedTypes.some(type => {
                if (type.includes('/*')) {
                    const mainType = type.split('/')[0];
                    return fileType.startsWith(mainType);
                }
                return fileType === type;
            });

            if (!isValidType) {
                setError(prev => ({
                    ...prev,
                    [fieldName]: `Please upload ${allowedTypes.join(', ')} files`
                }))
                return;
            }
        }

        setUploadData(prev => ({
            ...prev,
            [fieldName]: file
        }));
    };

    const clearFile = (fieldName) => {
        setUploadData(prev => ({
            ...prev,
            [fieldName]: null
        }));
    };

    const handleUploadMusic = async () => {
        if (!uploadData.title || !uploadData.uri || !uploadData.genre) {
            Swal.fire({
                icon: 'error',
                title: 'Missing Information',
                text: 'Please provide song title, genre, and audio file',
                timer: 2000
            });
            return;
        }

        const formData = new FormData();
        formData.append("title", uploadData.title);
        formData.append("genre", uploadData.genre);
        formData.append("music", uploadData.uri);
        if (uploadData.image) {
            formData.append("image", uploadData.image);
        }

        try {
            const response = await dispatch(createMusic(formData)).unwrap();

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `"${uploadData.title}" has been uploaded successfully`,
                timer: 2000,
                showConfirmButton: false
            });

            setUploadData({
                title: "",
                genre: "",
                uri: null,
                image: null
            });

            onClose();

        } catch (error) {
            onClose();

            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: error.message || 'Something went wrong',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl px-8 py-4 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto hide-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-2 rounded-xl">
                            <Upload className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                            Upload New Song
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                            Song Title <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                            <input
                                type="text"
                                value={uploadData.title}
                                onChange={(e) =>
                                    setUploadData({
                                        ...uploadData,
                                        title: e.target.value,
                                    })
                                }
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Enter song title"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                            Genre <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                            <select
                                value={uploadData.genre}
                                onChange={(e) =>
                                    setUploadData({
                                        ...uploadData,
                                        genre: e.target.value,
                                    })
                                }
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-10 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                                required
                            >
                                <option value="">Select a genre</option>
                                {genreList?.map((genre, index) => (
                                    <option key={index} value={genre}>
                                        {genre}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        {genreList?.length === 0 && (
                            <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                No genres available. Please add genres first.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                            Audio File <span className="text-red-500">*</span>
                            <span className="text-xs text-gray-500 ml-2">(MP3, WAV, etc.)</span>
                        </label>
                        <div className="border-2 border-dashed border-purple-200 rounded-lg p-4 hover:border-purple-400 transition-colors">
                            <input
                                type="file"
                                accept="audio/*"
                                id="audio-upload"
                                onChange={handleFileChange('uri', 10, ['audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/mp3'])}
                                className="hidden"
                            />
                            {!uploadData.uri ? (
                                <label
                                    htmlFor="audio-upload"
                                    className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                                >
                                    <FileAudio className="w-12 h-12 text-purple-400" />
                                    <p className="text-sm text-gray-500">Click to upload audio file</p>
                                    <p className="text-xs text-gray-400">MP3, WAV, M4A up to 10MB</p>
                                </label>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-purple-100 p-2 rounded-lg">
                                            <Music className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">{uploadData.uri.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {(uploadData.uri.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => clearFile('uri')}
                                        className="text-red-500 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                                       {error?.uri && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.uri}
                  </p>
                )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                            Cover Image
                        </label>
                        <div className="border-2 border-dashed border-purple-200 rounded-lg p-4 hover:border-purple-400 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                id="image-upload"
                                onChange={handleFileChange('image', 2, ['image/jpeg', 'image/png'])}
                                className="hidden"
                            />
                            {!uploadData.image ? (
                                <label
                                    htmlFor="image-upload"
                                    className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Image className="w-12 h-12 text-purple-400" />
                                    <p className="text-sm text-gray-500">Click to upload cover image</p>
                                    <p className="text-xs text-gray-400">JPG, PNG, GIF up to 2MB</p>
                                </label>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img
                                            src={URL.createObjectURL(uploadData.image)}
                                            alt="Preview"
                                            className="w-20 h-20 object-cover rounded-lg shadow-md"
                                        />
                                        <button
                                            onClick={() => clearFile('image')}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">{uploadData.image.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {(uploadData.image.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {error?.image && (
                            <p className="text-red-500 text-xs mt-1">
                                {error.image}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Recommended: Square image, 500x500 pixels
                        </p>
                    </div>

                    <button
                        onClick={handleUploadMusic}
                        disabled={createLoading || !uploadData.title || !uploadData.uri || !uploadData.genre}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
                    >
                        {createLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Upload Song
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(SongUploadModal);