// Components/Artist/ArtistSongsModal.jsx
import React, { useState } from 'react';
import { FaPlay, FaPlus, FaTimes, FaMusic, FaPause, FaHeart, FaShare, FaDownload } from 'react-icons/fa';

const ArtistSongsModal = ({ artist, onClose }) => {
  const [playingSong, setPlayingSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);

  const handlePlaySong = (song) => {
    if (playingSong?._id === song._id && isPlaying) {
      setIsPlaying(false);
      setPlayingSong(null);
    } else {
      setPlayingSong(song);
      setIsPlaying(true);
    }
  };

  const handleLikeSong = (songId) => {
    if (likedSongs.includes(songId)) {
      setLikedSongs(likedSongs.filter(id => id !== songId));
    } else {
      setLikedSongs([...likedSongs, songId]);
    }
  };

  const handleAddToPlaylist = (song) => {
    alert(`✨ "${song.title}" has been added to your playlist!`);
  };

  const handleShareSong = (song) => {
    alert(`🎵 Share "${song.title}" with your friends!`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
          >
            <FaTimes size={20} />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-6xl animate-bounce">🎤</div>
            <div>
              <h2 className="text-3xl font-bold">{artist.name}</h2>
              <p className="text-purple-100 mt-1">{artist.genre}</p>
              <p className="text-purple-100 text-sm mt-2">{artist.bio}</p>
              <div className="flex items-center space-x-4 mt-3">
                <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  📀 {artist.songsCount} Songs
                </span>
                <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  ⭐ 4.5 Rating
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Songs List */}
        <div className="overflow-y-auto max-h-[55vh]">
          {(!artist.songs || artist.songs.length === 0) ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎵</div>
              <p className="text-gray-500 text-lg">No songs available for this artist</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {artist.songs.map((song, index) => (
                <div
                  key={song._id}
                  className="flex items-center justify-between p-4 hover:bg-purple-50 transition-colors group"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="text-gray-400 font-medium w-8 text-center">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{song.title}</h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <span>{song.album || 'Single'}</span>
                        <span>•</span>
                        <span>{song.duration}</span>
                        <span>•</span>
                        <span>🎧 {song.plays || '1.2M'} plays</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleLikeSong(song._id)}
                      className={`p-2 rounded-full transition-colors ${
                        likedSongs.includes(song._id)
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                      }`}
                      title="Like"
                    >
                      <FaHeart size={14} />
                    </button>
                    <button
                      onClick={() => handlePlaySong(song)}
                      className={`p-2 rounded-full transition-colors ${
                        playingSong?._id === song._id && isPlaying
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                      }`}
                      title={playingSong?._id === song._id && isPlaying ? "Pause" : "Play"}
                    >
                      {playingSong?._id === song._id && isPlaying ? (
                        <FaPause size={14} />
                      ) : (
                        <FaPlay size={14} />
                      )}
                    </button>
                    <button
                      onClick={() => handleAddToPlaylist(song)}
                      className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600 transition-colors"
                      title="Add to playlist"
                    >
                      <FaPlus size={14} />
                    </button>
                    <button
                      onClick={() => handleShareSong(song)}
                      className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                      title="Share"
                    >
                      <FaShare size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Now Playing Section */}
        {playingSong && isPlaying && (
          <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 animate-slideUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="text-purple-600 animate-pulse">
                  <FaMusic size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Now Playing</p>
                  <p className="font-semibold text-gray-800">{playingSong.title}</p>
                  <p className="text-xs text-gray-500">{artist.name}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-purple-600 animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-1 h-4 bg-purple-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-4 bg-purple-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <button
                    onClick={() => handlePlaySong(playingSong)}
                    className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200"
                  >
                    <FaPause size={12} />
                  </button>
                  <button
                    onClick={() => handleDownloadSong(playingSong)}
                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600"
                    title="Download"
                  >
                    <FaDownload size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const handleDownloadSong = (song) => {
  alert(`⬇️ Downloading "${song.title}"...`);
};

export default ArtistSongsModal;