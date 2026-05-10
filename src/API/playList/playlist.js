import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../config"
import { act } from "react";


export const getPlayList = createAsyncThunk(
    "playlist/getPlayList",
    async (formData, { rejectWithValue }) => {

        try {
            const res = await api.get(`playlist`, formData);
            return res.data
        }
        catch (err) {
            return rejectWithValue(err.response.data);

        }
    }
)
export const getPlayListById = createAsyncThunk(
    "playlist/getPlayListById",
    async (id, { rejectWithValue }) => {

        try {
            const res = await api.get(`playlist/${id}`);
            return res.data
        }
        catch (err) {
            return rejectWithValue(err.response.data);

        }
    }
)


export const createPlayList = createAsyncThunk(
    "playlist/createPlayList",
    async (formData, { rejectWithValue }) => {

        try {
            const res = await api.post(`playlist`, formData);
            return res.data
        }
        catch (err) {
            return rejectWithValue(err.response.data);

        }
    }
)

export const updatePlayList = createAsyncThunk(
    "playlist/updatePlayList",
    async ({id,formData}, { rejectWithValue }) => {

        try {
            const res = await api.put(`playlist/${id}`, formData);
            return res.data
        }
        catch (err) {
            return rejectWithValue(err.response.data);

        }
    }
)

export const deletePlayList = createAsyncThunk(
    "playlist/deletePlayList",
    async (id, { rejectWithValue }) => {

        try {
            const res = await api.delete(`playlist/${id}`);
            return res.data
        }
        catch (err) {
            return rejectWithValue(err.response.data);

        }
    }
)


const playlistSlice = createSlice({
    name: "playlist",
    initialState: {
        playList: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createPlayList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPlayList.fulfilled, (state, action) => {
                state.loading = false;
                state.playList = action.payload.data;
                state.error = null;
            })
            .addCase(createPlayList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.playList = [];
            })
            .addCase(getPlayList.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.playList = [];
            })
            .addCase(getPlayList.fulfilled, (state, action) => {
                state.loading = false;
                state.playList = action.payload.data;
                state.error = null;
            })
            .addCase(getPlayList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.playList = [];
            })
            .addCase(getPlayListById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.playListById = null;
            })
            .addCase(getPlayListById.fulfilled, (state, action) => {
                state.loading = false;
                state.playListById = action.payload.data;
                state.error = null;
            })
            .addCase(getPlayListById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.playListById = null;
            })
                  .addCase(deletePlayList.pending, (state) => {
                state.error = null;
            })
            .addCase(deletePlayList.fulfilled, (state, action) => {
                state.error = null;
                const id= action.meta.arg;
                state.playList=state.playList.filter((play)=> play._id !== id)
            })
            .addCase(deletePlayList.rejected, (state, action) => {
                state.error = action.payload;
            })



    }
})

export default playlistSlice.reducer

