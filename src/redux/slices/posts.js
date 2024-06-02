import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get("/posts");
  return data;
});

export const fetchPopularPosts = createAsyncThunk(
  "posts/fetchPopularPosts",
  async () => {
    const { data } = await axios.get("/posts/popular");
    return data;
  }
);

export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/posts/tags");
  return data;
});

export const fetchPopularTags = createAsyncThunk(
  "posts/fetchPopularTags",
  async () => {
    const { data } = await axios.get("/posts/tags");
    return data;
  }
);

export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id) => {
    const { data } = await axios.delete(`/posts/${id}`);
    return data;
  }
);

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducer: {},
  extraReducers: {
    // Получение статей
    [fetchPosts.pending]: (state) => {
      state.posts.status = "loading";
      state.posts.items = [];
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.status = "success";
      state.posts.items = action.payload;
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.status = "failed";
      state.posts.items = [];
    },
    // Получение популярных статей
    [fetchPopularPosts.pending]: (state) => {
      state.posts.status = "loading";
      state.posts.items = [];
    },
    [fetchPopularPosts.fulfilled]: (state, action) => {
      state.posts.status = "success";
      state.posts.items = action.payload;
    },
    [fetchPopularPosts.rejected]: (state) => {
      state.posts.status = "failed";
      state.posts.items = [];
    },
    // Получение тегов
    [fetchTags.pending]: (state) => {
      state.tags.status = "loading";
      state.tags.items = [];
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.status = "success";
      state.tags.items = action.payload;
    },
    [fetchTags.rejected]: (state) => {
      state.tags.status = "failed";
      state.tags.items = [];
    },
    // Получение популярных тегов
    [fetchPopularTags.pending]: (state) => {
      state.tags.status = "loading";
      state.tags.items = [];
    },
    [fetchPopularTags.fulfilled]: (state, action) => {
      state.tags.status = "success";
      state.tags.items = action.payload;
    },
    [fetchPopularTags.rejected]: (state) => {
      state.tags.status = "failed";
      state.tags.items = [];
    },
    // Удаление статьи
    [fetchRemovePost.pending]: (state) => {
      state.posts.status = "loading";
    },
    [fetchRemovePost.fulfilled]: (state, action) => {
      state.posts.status = "success";
      state.posts.items = state.posts.items.filter(
        (item) => item._id !== action.payload
      );
      console.log(action.payload);
    },
    [fetchRemovePost.rejected]: (state) => {
      state.posts.status = "failed";
    },
  },
});

export const postsReducer = postsSlice.reducer;
