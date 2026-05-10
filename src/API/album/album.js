import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../config"

export const getAlbumList = createAsyncThunk(
    "album/getAlbumList",
    async (artistId, { rejectWithValue }) => {
        try {
            const url = artistId ? `music/album?artistId=${artistId}` : "music/album";
            const res = await api.get(url);
            return res.data
        }
        catch (err) {
            return rejectWithValue(err.response.data);

        }
    }
)

export const createAlbum = createAsyncThunk(
    "album/createAlbum",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post("music/album", formData);
            return res.data
        }
        catch (err) {
            return rejectWithValue(err.response.data);

        }
    }
)

export const updateAlbum = createAsyncThunk(
    "album/updateAlbum",
    async ({ id, formData }, { rejectWithValue }) => {
        console.log("formData", formData);

        try {
            const res = await api.put(`music/album/${id}`, formData);
            return res.data
        }
        catch (err) {
            return rejectWithValue(err.response.data);

        }
    }
)

export const getMusicByAlbum = createAsyncThunk(
    "album/getMusicByAlbum",
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`music/album/${id}`);
            return res.data
        }
        catch (err) {
            return rejectWithValue(err.response.data);

        }
    }
)

export const deleteAlbum = createAsyncThunk(
    "album/deleteAlbum",
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.delete(`music/album/${id}`);
            return res.data;
        }
        catch (err) {
            return rejectWithValue(
                err?.response?.data || { message: "Something went wrong" }
            );
        }
    })



const albumSlice = createSlice({
    name: "album",
    initialState: {
        albumList: [],
        albumMusicsList: [],
        albumLoading: false,
        loading: false,
        createAlbumLoading: false,
        error: null

    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getAlbumList.pending, (state) => {
                state.albumLoading = true;
                state.error = null;
                state.albumList = [];

            })
            .addCase(getAlbumList.fulfilled, (state, action) => {
                state.albumLoading = false;
                state.albumList = action.payload.data;
                state.error = null;
            })
            .addCase(getAlbumList.rejected, (state, action) => {
                state.albumLoading = false;
                state.error = action.payload;
                state.albumList = [];
            })
            .addCase(getMusicByAlbum.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMusicByAlbum.fulfilled, (state, action) => {
                state.loading = false;
                state.albumMusicsList = action.payload.data;
                state.error = null;
            })
            .addCase(getMusicByAlbum.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createAlbum.pending, (state) => {
                state.createAlbumLoading = true;
                state.error = null;
            })
            .addCase(createAlbum.fulfilled, (state, action) => {
                state.albumList.push(action.payload.album);
                state.createAlbumLoading = false;
                state.error = null;
            })
            .addCase(createAlbum.rejected, (state, action) => {
                state.createAlbumLoading = false;
                state.error = action.payload;
            })
            .addCase(updateAlbum.pending, (state) => {
                state.createAlbumLoading = true;
                state.error = null;
            })
            .addCase(updateAlbum.fulfilled, (state, action) => {
                const { id } = action.meta.arg

                state.albumList = state.albumList.map((album) =>
                    album._id === id ?
                        action.payload.data : album
                )
                state.createAlbumLoading = false;
                state.error = null;
            })
            .addCase(updateAlbum.rejected, (state, action) => {
                state.createAlbumLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteAlbum.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAlbum.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const albumId = action.meta.arg;
                state.albumList = state.albumList.filter(
                    (album) => album._id !== albumId
                );
            })
            .addCase(deleteAlbum.rejected, (state) => {
                state.loading = true;
                state.error = null;
            })

    }
})

export default albumSlice.reducer

