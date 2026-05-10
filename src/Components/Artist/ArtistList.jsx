import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getArtistList } from "../../API/artist/artist";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function ArtistList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { artistList, pagination, loading } = useSelector(
    (store) => store.artist
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const scrollRef = useRef(null);

  useEffect(() => {
    const updateLimit = () => {
      if (window.innerWidth < 640) {
        setLimit(2);
      } else if (window.innerWidth < 768) {
        setLimit(3); 
      } else if (window.innerWidth < 1024) {
        setLimit(4); 
      } else {
        setCurrentPage(1)
        setLimit(5); 
      }
    };

    updateLimit();

    window.addEventListener("resize", updateLimit);

    return () => {
      window.removeEventListener("resize", updateLimit);
    };
  }, []);

  useEffect(() => {
    dispatch(
      getArtistList({
        page: currentPage,
        limit,
        search: "",
      })
    );
  }, [dispatch, currentPage, limit]);

  const handleArtistClick = (artistId) => {
    navigate(`/artist/music/${artistId}`);
  };

  const scrollLeft = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }

    scrollRef.current?.scrollBy({
      left: -400,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (currentPage < pagination?.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }

    scrollRef.current?.scrollBy({
      left: 400,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Featured Artists
        </h2>

        <p className="text-gray-600">
          Discover amazing artists and their music
        </p>
      </div>

      <div className="relative">

        <button
          onClick={scrollLeft}
          disabled={currentPage === 1}
          className={`
            absolute left-0 top-1/2 -translate-y-1/2 z-10
            rounded-full p-3 shadow-lg transition-all duration-300
            ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-purple-500 hover:text-white cursor-pointer"
            }
          `}
        >
          <FaChevronLeft />
        </button>

        {loading ? (
          <div className="flex gap-8 justify-center py-4">
            {[...Array(limit)].map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center animate-pulse"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gray-300"></div>

                <div className="mt-4 h-4 w-24 bg-gray-300 rounded"></div>

                <div className="mt-2 h-3 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
          className={`
  flex gap-4 sm:gap-6 md:gap-8
  overflow-hidden py-4 px-10 sm:px-14
  ${
    artistList?.length <= 1
      ? "justify-start"
      : "justify-center"
  }
`}
          >
            {artistList?.map((artist) => (
              <div
                key={artist?._id}
                onClick={() => handleArtistClick(artist?._id)}
                className="
                  group cursor-pointer flex-shrink-0
                  transform transition-all duration-300
                  hover:-translate-y-2
                "
              >
                <div className="relative">

                  <div
                    className="
                      w-24 h-24
                      sm:w-28 sm:h-28
                      md:w-36 md:h-36
                      lg:w-40 lg:h-40
                      rounded-full overflow-hidden shadow-lg
                      group-hover:shadow-2xl transition-all duration-300
                    "
                  >
                    {artist?.artistProfile?.profileImage ? (
                      <img
                        src={artist?.artistProfile?.profileImage}
                        alt={artist?.artistProfile?.stageName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                        <span className="text-2xl md:text-4xl text-white">
                          {artist?.artistProfile?.stageName
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-purple-400 transition-all duration-300"></div>
                </div>

                <div className="text-center mt-4">
                  <h3 className="font-semibold text-sm md:text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                    {artist?.artistProfile?.stageName}
                  </h3>

                  <p className="text-xs md:text-sm text-gray-500">
                    {artist?.artistProfile?.totalSongs || 0} songs
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={scrollRight}
          disabled={currentPage === pagination?.totalPages}
          className={`
            absolute right-0 top-1/2 -translate-y-1/2 z-10
            rounded-full p-3 shadow-lg transition-all duration-300
            ${
              currentPage === pagination?.totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-purple-500 hover:text-white cursor-pointer"
            }
          `}
        >
          <FaChevronRight />
        </button>
      </div>

      {!loading && (!artistList || artistList.length === 0) && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎤</div>

          <p className="text-gray-500 text-lg">
            No artists found
          </p>
        </div>
      )}
    </div>
  );
}

export default ArtistList;