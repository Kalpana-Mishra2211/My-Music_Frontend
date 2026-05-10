import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../config";


export const getArtistList = createAsyncThunk(
    "artist/getArtistList",
    async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
        try {
            const res = await api.get(`artist`, {
                params: { page, limit, search },
            });

            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);


export const getArtistDetails = createAsyncThunk(
    "artist/getArtistDetails",
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`artist/details/${id}`);

            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);


export const getMusicByArtistId = createAsyncThunk(
    "artist/getMusicByArtistId",
    async (
        { id, page = 1, limit = 10, search = "" },
        { rejectWithValue }
    ) => {
        try {
            const res = await api.get(`artist/music/${id}`, {
                params: { page, limit, search },
            });

            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);


export const getArtistProfile = createAsyncThunk(
    "artist/getArtistProfile",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(`artist/profile`);

            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);



export const updateArtistProfile = createAsyncThunk(
    "artist/updateArtistProfile",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.put(`artist/profile`, formData);

            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);



export const getStats = createAsyncThunk(
    "artist/getStats",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(`artist/stats`);

            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const toggleFollowArtist = createAsyncThunk(
    "artist/toggleFollowArtist",
    async (artistId, { rejectWithValue }) => {
        try {
            const res = await api.post(`user/artist/${artistId}/follow-toggle`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);
export const getFollower = createAsyncThunk(
    "artist/getFollower",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(`user/followers`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);
export const getFollowing = createAsyncThunk(
    "artist/getFollowing",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(`user/following`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);



const artistSlice = createSlice({
    name: "artist",

    initialState: {
        artistList: [],
        artistDetails: null,
        musicList: [],
        followers: [],
        following: [],
        pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 1,
        },

        profile: null,
        stats: null,
        loading: false,
        musicLoading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder


            .addCase(getArtistList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getArtistList.fulfilled, (state, action) => {
                state.loading = false;
                state.artistList = action.payload.data;
                state.pagination = {
                    page: action.payload.pagination?.page || 1,
                    limit: action.payload.pagination?.limit || 10,
                    total: action.payload.pagination?.total || 0,
                    totalPages: action.payload.pagination?.totalPages || 1,
                };
            })

            .addCase(getArtistList.rejected, (state, action) => {
                state.loading = false;
                state.artistList = [];
                state.error = action.payload;
            })


            .addCase(getArtistDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getArtistDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.artistDetails = action.payload.artist;
            })

            .addCase(getArtistDetails.rejected, (state, action) => {
                state.loading = false;
                state.artistDetails = null;
                state.error = action.payload;
            })

            .addCase(getMusicByArtistId.pending, (state) => {
                state.musicLoading = true;
                state.error = null;
            })

            .addCase(getMusicByArtistId.fulfilled, (state, action) => {
                state.musicLoading = false;

                state.musicList = action.payload.musics;

                state.pagination = {
                    page: action.payload.pagination?.page || 1,
                    limit: action.payload.pagination?.limit || 10,
                    total: action.payload.pagination?.total || 0,
                    totalPages: action.payload.pagination?.totalPages || 1,
                };
            })

            .addCase(getMusicByArtistId.rejected, (state, action) => {
                state.musicLoading = false;
                state.musicList = [];
                state.error = action.payload;
            })



            .addCase(getArtistProfile.pending, (state) => {
                state.loading = true;
            })

            .addCase(getArtistProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload.user;
            })

            .addCase(getArtistProfile.rejected, (state, action) => {
                state.loading = false;
                state.profile = null;
                state.error = action.payload;
            })
            .addCase(getStats.pending, (state) => {
                state.loading = true;
            })

            .addCase(getStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.stats;
            })

            .addCase(getStats.rejected, (state, action) => {
                state.loading = false;
                state.stats = null;
                state.error = action.payload;
            })

            .addCase(toggleFollowArtist.pending, (state) => {
                state.error = null;
            })

            .addCase(toggleFollowArtist.fulfilled, (state, action) => {
                state.error = null;

                const artistId = action.meta.arg;
                const { isFollowing, followersCount } = action.payload;

                if (
                    state.artistDetails &&
                    state.artistDetails?._id === artistId
                ) {
                    state.artistDetails.followersCount = followersCount;
                    state.artistDetails.isFollowing = isFollowing ? true : false;
                }
                if (!isFollowing) {
                    state.following = state.following.filter(
                        (user) => user._id !== artistId
                    );
                }
                if (!isFollowing) {
                    state.followers = state.followers.map((user) =>
                        user._id === artistId
                            ? { ...user, I_Follow: false }
                            : user
                    );
                } else {
                    state.followers = state.followers.map((user) =>
                        user._id === artistId
                            ? { ...user, I_Follow: true }
                            : user
                    );
                }
            })

            .addCase(toggleFollowArtist.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(getFollower.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getFollower.fulfilled, (state, action) => {
                state.loading = false;
                state.followers = action.payload.followers;
            })

            .addCase(getFollower.rejected, (state, action) => {
                state.loading = false;
                state.followers = [];
                state.error = action.payload;
            })
            .addCase(getFollowing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getFollowing.fulfilled, (state, action) => {
                state.loading = false;
                state.following = action.payload.following;
            })

            .addCase(getFollowing.rejected, (state, action) => {
                state.loading = false;
                state.following = [];
                state.error = action.payload;
            })
    },
});

export default artistSlice.reducer;