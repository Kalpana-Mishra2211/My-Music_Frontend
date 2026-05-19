import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Repeat, Shuffle as ShuffleIcon } from "lucide-react";
import { formatTime } from "../../utils/helper";

function CurrentTrackPlayer({
  currentTrack,
  musicList = [],
  onTrackChange,
  isPlaying: externalIsPlaying,
  onPlayStateChange
}) {


  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const audioRef = useRef(null);

  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    const updateTime = () => setCurrentTime(audio.currentTime)

    audio.addEventListener("timeupdate", updateTime);

    return () => {
      audio.pause();

      audio.src = "";
      audio.removeEventListener("timeupdate", updateTime);

    };
  }, []);

  useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;
  const onEnded = () => {

    if (isRepeat) {
      audio.currentTime = 0;
      audio.play();

    } else if (isShuffle && musicList.length > 1) {
      playRandomTrack();
      
    } else {
      playNextTrack();
    }
  };

  audio.addEventListener("ended", onEnded);

  return () => {
    audio.removeEventListener("ended", onEnded);
  };
}, [isRepeat, isShuffle, currentTrack, musicList]);

  const handleTrackEnd = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (isShuffle && musicList.length > 1) {
      playRandomTrack();
    } else {
      playNextTrack();
    }
  };

const playNextTrack = () => {
  if (!currentTrack || musicList.length === 0) return;
  const currentIndex = musicList.findIndex(
    track => track._id === currentTrack._id
  );
  if (currentIndex === -1) return;

  const nextIndex = (currentIndex + 1) % musicList.length;  if (onTrackChange) {
    onTrackChange(musicList[nextIndex]);
  }
};

const playPreviousTrack = () => {
  if (!currentTrack || musicList.length === 0) return;

  const currentIndex = musicList.findIndex(
    track => track._id === currentTrack._id
  );
  if (currentIndex === -1) return;
  const prevIndex =
    (currentIndex - 1 + musicList.length) % musicList.length;

  if (onTrackChange) {
    onTrackChange(musicList[prevIndex]);
  }
};

  const playRandomTrack = () => {
    if (musicList.length === 0) return;
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * musicList.length);
    } while (musicList.length > 1 && musicList[randomIndex]._id === currentTrack?._id);
    if (onTrackChange) {
      onTrackChange(musicList[randomIndex]);
    }
  };

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    audioRef.current.src = currentTrack?.uri;
    audioRef.current.load();

    if (isPlaying) {
      audioRef.current.play().catch(err => console.log("Play error:", err));
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(err => console.log("Play error:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handlePlayPause = () => {

    const newPlayState = !isPlaying;
    if (onPlayStateChange) {
      onPlayStateChange(newPlayState);
    } else {
      setInternalIsPlaying(newPlayState);
    }
  };

  const progressPercent = currentTrack?.duration ? (currentTime / currentTrack?.duration) * 100 : 0;
  const volumePercent = volume * 100;

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-xl border-t border-purple-500/30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
        <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentTrack?.image}
                alt={currentTrack?.title}
                className="w-14 h-14 rounded-lg object-cover shadow-lg ring-2 ring-purple-500/50"
              />
              {isPlaying && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-white font-semibold text-sm truncate">
                {currentTrack?.title}
              </h4>
              <p className="text-purple-300 text-xs">
                {currentTrack?.artist?.artistProfile?.stageName || 'Unknown Artist'}
              </p>
            </div>
          </div>

      <div className="flex flex-col items-center w-full lg:flex-1 max-w-xl gap-2">
            <div className="flex items-center gap-4">
              <button
                onClick={playPreviousTrack}
                className="text-gray-400 hover:text-white transition transform hover:scale-110"
                disabled={musicList.length <= 1}
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={handlePlayPause}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 shadow-lg"
              >
                {isPlaying ?
                  <Pause className="w-5 h-5 text-white fill-white" /> :
                  <Play className="w-5 h-5 text-white ml-0.5" />
                }
              </button>

              <button
                onClick={playNextTrack}
                className="text-gray-400 hover:text-white transition transform hover:scale-110"
                disabled={musicList.length <= 1}
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

      <div className="flex items-center gap-2 md:gap-3 w-full">
          <span className="text-[10px] md:text-xs text-gray-400 font-mono w-10 text-center">
                {formatTime(currentTime)}
              </span>

              <div className="relative flex-1 group">
                <input
                  type="range"
                  min="0"
                  max={currentTrack?.duration || 0}
                  value={currentTime}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (audioRef.current) {
                      audioRef.current.currentTime = val;
                      setCurrentTime(val);
                    }
                  }}
                  className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #a855f7 ${progressPercent}%, #4a4a5a ${progressPercent}%)`,
                  }}
                />
              </div>

              <span className="text-xs text-gray-400 font-mono">
                {formatTime(currentTrack?.duration)}
              </span>
            </div>
          </div>

      <div className="flex items-center justify-center lg:justify-end gap-3 w-full lg:w-auto min-w-0 lg:min-w-[200px]">
            <button
              onClick={() => {
                setIsShuffle(!isShuffle);
                if (!isShuffle) setIsRepeat(false);
              }}
              className={`transition ${isShuffle ? "text-purple-500" : "text-gray-400 hover:text-white"}`}
              title="Shuffle"
            >
              <ShuffleIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsRepeat(!isRepeat);
                if (!isRepeat) setIsShuffle(false);
              }}
              className={`transition ${isRepeat ? "text-purple-500" : "text-gray-400 hover:text-white"}`}
              title="Repeat"
            >
              <Repeat className="w-4 h-4" />
            </button>

        <div className="flex items-center gap-2">
              <button
                onClick={() => setVolume(volume === 0 ? 1 : 0)}
                className="text-gray-400 hover:text-white transition"
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 h-1 rounded-lg"
                style={{
                  background: `linear-gradient(to right, #a855f7 ${volume * 100}%, #4a4a5a ${volume * 100}%)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(CurrentTrackPlayer);