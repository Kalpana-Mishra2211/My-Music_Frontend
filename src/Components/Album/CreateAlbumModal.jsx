import React, { useState, useEffect } from "react";
import {
  X,
  Image,
  Music,
  FileText,
  Trash2,
  CheckCircle,
  Loader2,
  Plus,
  Search,
  Check,
  XCircle
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getMusicList } from "../../API/music/music";
import { createAlbum, getMusicByAlbum, updateAlbum } from "../../API/album/album";
import { formatTime } from "../../utils/helper";
import Swal from "sweetalert2";

const CreateAlbumModal = ({ isOpen, onClose, onAlbumCreated, id }) => {
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const dispatch = useDispatch();
  const { musicsList } = useSelector((store) => store.music);
  const { createAlbumLoading, albumMusicsList } = useSelector((store) => store.album);

  const [originalData, setOriginalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMusicSelector, setShowMusicSelector] = useState(false);
  const [albumData, setAlbumData] = useState({
    title: "",
    description: "",
    image: null,
    musics: []
  });
  const [error, setError] = useState({})
  const [previewUrl, setPreviewUrl] = useState(null);


  useEffect(() => {
    if (id) {
      dispatch(getMusicByAlbum(id))
    }
  }, [dispatch, id])


  useEffect(() => {
    if (id && albumMusicsList) {
      const data = {
        title: albumMusicsList.title || "",
        description: albumMusicsList.description || "",
        image: albumMusicsList.image || null,
        musics: albumMusicsList.musics?.map(m => m._id) || [],
      };

      setAlbumData(data);
      setOriginalData(data);
      setPreviewUrl(albumMusicsList.image);
    }
  }, [id, albumMusicsList]);


  const openMusicSelector = () => {
    setShowMusicSelector(true);
    dispatch(getMusicList(userData.id));


  }
  const filteredMusic = musicsList?.filter((music) => {
    const query = searchTerm.toLowerCase();
    return (
      music?.title?.toLowerCase().includes(query) ||
      music?.artist?.userName?.toLowerCase().includes(query)
    );
  }) || [];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setError(pre => ({
      ...pre,
      image: ""
    }))
    const allowedType = ['image/jpeg', 'image/png']

    if (!allowedType.includes(file.type)) {
      setError(pre => ({
        ...pre,
        image: "Only JPG and PNG files are allowed"
      }))
      return;
    }

    if (file) {
      setAlbumData({ ...albumData, image: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setAlbumData({ ...albumData, image: null });
    if (previewUrl) {
      setPreviewUrl(null);
    }
  };

  const handleInputChange = (e) => {
    setAlbumData({
      ...albumData,
      [e.target.name]: e.target.value
    });
  };

  const handleMusicSelect = (musicId) => {
    setAlbumData(prev => {
      const isSelected = prev.musics.includes(musicId);
      if (isSelected) {
        return { ...prev, musics: prev.musics.filter(id => id !== musicId) };
      } else {
        return { ...prev, musics: [...prev.musics, musicId] };
      }
    });
  };

  const handleSelectAll = () => {
    if (albumData.musics.length === filteredMusic.length) {
      setAlbumData({ ...albumData, musics: [] });
    } else {
      setAlbumData({ ...albumData, musics: filteredMusic.map(m => m._id) });
    }
  };

  const removeMusic = (musicId) => {
    setAlbumData({
      ...albumData,
      musics: albumData.musics.filter(id => id !== musicId)
    });
  };

  const getSelectedMusicDetails = () => {
    return musicsList.filter(music => albumData.musics.includes(music._id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      Swal.fire({
        title: id ? "Updating Album..." : "Creating Album...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const formData = new FormData();

      if (!id) {
        formData.append("title", albumData.title);
        formData.append("description", albumData.description);

        if (albumData.image) {
          formData.append("image", albumData.image);
        }

        albumData.musics.forEach((musicId) => {
          formData.append("musics", musicId);
        });
        onClose();

        await dispatch(createAlbum(formData)).unwrap();

        await Swal.fire({
          icon: "success",
          title: "Success 🎉",
          text: "Album created successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        if (albumData.title !== originalData?.title) {
          formData.append("title", albumData.title);
        }

        if (albumData.description !== originalData?.description) {
          formData.append("description", albumData.description);
        }

        if (albumData.image instanceof File) {
          formData.append("image", albumData.image);
        }

        const musicChanged =
          JSON.stringify(albumData.musics) !==
          JSON.stringify(originalData?.musics);

        if (musicChanged) {
          albumData.musics.forEach((musicId) => {
            formData.append("musics", musicId);
          });
        }

        if ([...formData.entries()].length === 0) {
          return Swal.fire({
            icon: "info",
            title: "No Changes",
            text: "No changes detected",
          });
        }

        await dispatch(updateAlbum({ id, formData })).unwrap();
        onClose();
        await Swal.fire({
          icon: "success",
          title: "Updated 🎉",
          text: "Album updated successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      setSearchTerm("");
      setShowMusicSelector(false);

    } catch (error) {
      console.error("Error submitting album:", error);
      onClose();

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.message || "Something went wrong",
      });
    }
  };
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4 overflow-y-auto "
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky z-50 top-0 bg-white border-b border-purple-100 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-2 rounded-xl">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                {id ? "Edit Album" : "Create New Album"
                }              </h2>
              <p className="text-sm text-gray-500">Fill in the details to create your album</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 px-6 space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Album Cover Image
            </label>
            <div className="border-2 border-dashed border-purple-200 rounded-lg p-4 hover:border-purple-400 transition-colors">
              {!previewUrl ? (
                <label className="flex flex-col items-center justify-center gap-2 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Image className="w-12 h-12 text-purple-400" />
                  <p className="text-sm text-gray-500">Click to upload cover image</p>
                  <p className="text-xs text-gray-400">JPG, PNG, GIF up to 5MB</p>
                </label>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Album Cover</p>
                    <p className="text-xs text-gray-500">Click the trash icon to change</p>
                  </div>
                </div>
              )}

            </div>
            {error?.image && (
              <p className="text-red-500 text-xs mt-1">
                {error.image}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Album Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type="text"
                name="title"
                value={albumData.title}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter album title"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
              <textarea
                name="description"
                value={albumData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe your album..."
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700 font-medium">
                Select Music <span className="text-red-500">*</span>
              </label>
              {albumData.musics.length > 0 && (
                <span className="text-sm text-purple-600">
                  {albumData.musics.length} song(s) selected
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={openMusicSelector}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-center hover:border-purple-400 transition-colors"
            >
              {albumData.musics.length === 0 ? (
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <Music className="w-5 h-5" />
                  <span>Click to select music for your album</span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">
                    {albumData.musics.length} music(s) selected
                  </span>
                  <span className="text-purple-600 text-sm">Change selection</span>
                </div>
              )}
            </button>

            {showMusicSelector && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000] p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">Select Music</h3>
                    <button
                      onClick={() => setShowMusicSelector(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search music..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4">
                    {filteredMusic?.length === 0 ? (
                      <div className="text-center py-12">
                        <Music className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No music found</p>
                        <p className="text-sm text-gray-400 mt-1">Upload some music first</p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-2 flex justify-between items-center px-2">
                          <span className="text-sm text-gray-500">
                            {filteredMusic.length} music(s) available
                          </span>
                          {filteredMusic.length > 0 && (
                            <button
                              type="button"
                              onClick={handleSelectAll}
                              className="text-sm text-purple-600 hover:text-purple-700"
                            >
                              {albumData.musics.length === filteredMusic.length ? "Deselect All" : "Select All"}
                            </button>
                          )}
                        </div>

                        <div className="space-y-2">
                          {filteredMusic.map((music) => (
                            <div
                              key={music._id}
                              onClick={() => handleMusicSelect(music._id)}
                              className="flex items-center justify-between p-3 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {music.image && (
                                  <img
                                    src={music.image}
                                    alt={music.title}
                                    className="w-10 h-10 rounded object-cover"
                                    onError={(e) => e.target.style.display = 'none'}
                                  />
                                )}
                                <div>
                                  <p className="font-medium text-gray-800">{music?.title}</p>
                                  <p className="text-sm text-gray-500">{music?.artist?.userName}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-400">{formatTime(music.duration)}</span>
                                {albumData.musics.includes(music._id) && (
                                  <Check className="w-5 h-5 text-purple-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-4 border-t border-gray-200 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowMusicSelector(false)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800"
                    >
                      Done ({albumData.musics.length} selected)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {getSelectedMusicDetails().length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Selected Music ({getSelectedMusicDetails().length})
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto hide-scrollbar">
                {getSelectedMusicDetails().map((music) => (
                  <div key={music._id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      {music.image && (
                        <img
                          src={music.image}
                          alt={music.title}
                          className="w-10 h-10 rounded object-cover"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800">{music.title}</p>
                        <p className="text-xs text-gray-500">{music.artist.userName}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMusic(music._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createAlbumLoading || !albumData.title || albumData.musics.length === 0}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {(createAlbumLoading) ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {id ? "Update Album" : "Create Album"
                  }                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAlbumModal;