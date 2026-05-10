import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../config"

export const getMusicList = createAsyncThunk(
    "music/getMusicList",
    async (artistId, { rejectWithValue }) => {
        try {
            const url = artistId ? `music?artistId=${artistId}` : "/music";

            const res = await api.get(url);

            return res.data;
        } catch (err) {
            return rejectWithValue(
                err?.response?.data || { message: "Something went wrong" }
            );
        }
    }
);

export const getGenreList = createAsyncThunk(
    "music/getGenreList",
    async (artistId, { rejectWithValue }) => {
        try {

            const res = await api.get("artist/genres");

            return res.data;
        } catch (err) {
            return rejectWithValue(
                err?.response?.data || { message: "Something went wrong" }
            );
        }
    }
);

export const createMusic = createAsyncThunk(
    "music/createMusic",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post("music", formData);
            return res.data
        }
        catch (err) {
            return rejectWithValue(err.response.data);

        }
    }
)

export const toggleFavorite = createAsyncThunk(
    "music/toggleFavorite",
    async (musicId, { rejectWithValue }) => {
        try {
            const res = await api.post("user/favorite", { musicId });
            return res.data
        }
        catch (err) {
            return rejectWithValue(
                err?.response?.data || { message: "Something went wrong" }
            );
        }
    })

export const toggleLike = createAsyncThunk(
    "music/toggleLike",

    async (musicId, { rejectWithValue }) => {
        try {
            const res = await api.post("music/like", { musicId });
            return res.data
        }
        catch (err) {
            return rejectWithValue(
                err?.response?.data || { message: "Something went wrong" }
            );
        }
    })

export const getLikeList = createAsyncThunk(
    "music/getLikeList",

    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("music/like");
            return res.data
        }
        catch (err) {
            return rejectWithValue(
                err?.response?.data || { message: "Something went wrong" }
            );
        }
    })

export const getFavoriteList = createAsyncThunk(
    "music/getFavoriteList",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("user/favorite");
            return res.data;
        }
        catch (err) {
            return rejectWithValue(
                err?.response?.data || { message: "Something went wrong" }
            );
        }
    })

export const deleteMusic = createAsyncThunk(
    "music/deleteMusic",
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.delete(`music/${id}`);
            return res.data;
        }
        catch (err) {
            return rejectWithValue(
                err?.response?.data || { message: "Something went wrong" }
            );
        }
    })




const musicSlice = createSlice({
    name: "music",
    initialState: {
        musicsList: [],
        genreList: [],
        likeList: [],
        totalLikedSongs: null,
        favList: [],
        loading: false,
        createLoading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMusicList.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.musicsList = [];
            })
            .addCase(getMusicList.fulfilled, (state, action) => {
                state.loading = false;
                state.musicsList = action.payload.data;
                state.error = null;
            })
            .addCase(getMusicList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.musicsList = [];
            })
            .addCase(createMusic.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createMusic.fulfilled, (state, action) => {
                state.createLoading = false;
                state.error = null;
            })
            .addCase(createMusic.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload;
            })
            .addCase(toggleFavorite.pending, (state) => {
                state.error = null;
            })
            .addCase(toggleFavorite.fulfilled, (state, action) => {
                state.error = null;
                const musicId = action.meta.arg;
                const message = action.payload.message;
                state.musicsList = state.musicsList.map((music) => {
                    if (music._id === musicId) {
                        return {
                            ...music,
                            isFavorite: message.includes("Added") ? true : false,
                        };
                    }
                    return music;
                });

                if (message.includes("Removed")) {
                    state.favList = state.favList.filter(
                        (music) => music._id !== musicId
                    );
                }

            })
            .addCase(toggleFavorite.rejected, (state) => {
                state.error = null;
            })
            .addCase(toggleLike.pending, (state) => {
                state.error = null;
            })
            .addCase(toggleLike.fulfilled, (state, action) => {
                state.error = null;

                const musicId = action.meta.arg;
                const message = action.payload.message;
                const isUnliked = message.includes("unliked");

                state.musicsList = state.musicsList.map((music) => {
                    if (music._id === musicId) {
                        const isLiked = !isUnliked;
                        return {
                            ...music,
                            isLiked,
                            likesCount: isLiked
                                ? music.likesCount + 1
                                : Math.max(0, music.likesCount - 1),
                        };
                    }

                    return music;
                });
                state.favList = state.favList.map((music) => {
                    if (music._id === musicId) {
                        const isLiked = !isUnliked;
                        return {
                            ...music,
                            isLiked,
                            likesCount: isLiked
                                ? music.likesCount + 1
                                : Math.max(0, music.likesCount - 1),
                        };
                    }

                    return music;
                });
                if (isUnliked) {
                    state.likeList = state.likeList.filter(
                        (music) => music._id !== musicId
                    );
                }

            })
            .addCase(toggleLike.rejected, (state) => {
                state.error = null;
            })

            .addCase(getFavoriteList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFavoriteList.fulfilled, (state, action) => {
                state.loading = false;
                state.favList = action.payload.favorites;
                state.error = null;
            })
            .addCase(getFavoriteList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteMusic.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteMusic.fulfilled, (state, action) => {
                state.error = null;
                const musicId = action.meta.arg;
                state.musicsList = state.musicsList.filter(
                    (music) => music._id !== musicId
                );
            })
            .addCase(deleteMusic.rejected, (state) => {
                state.error = null;
            })
            .addCase(getGenreList.pending, (state) => {
                state.error = null;
                state.genreList = [];
            })
            .addCase(getGenreList.fulfilled, (state, action) => {
                state.genreList = action.payload.genres;
                state.error = null;
            })
            .addCase(getGenreList.rejected, (state, action) => {
                state.error = action.payload;
                state.genreList = [];
            })
            .addCase(getLikeList.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.likeList = [];
            })
            .addCase(getLikeList.fulfilled, (state, action) => {
                state.loading = false;
                state.totalLikedSongs = action.payload.data.totalLikedSongs;
                state.likeList = action.payload.data.likedSongs;
                state.error = null;
            })
            .addCase(getLikeList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.likeList = [];
            })
    }
})

export default musicSlice.reducer

