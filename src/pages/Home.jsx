import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

// import axios from "../axios";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import {
  fetchPosts,
  fetchTags,
  fetchPopularPosts,
  fetchPopularTags,
} from "../redux/slices/posts";

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const [value, setValue] = React.useState(0);

  const isPostsloading = posts.status === "loading";
  const isTagsloading = tags.status === "loading";

  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, []);

  const handlePopular = () => {
    dispatch(fetchPopularPosts());
    dispatch(fetchPopularTags());
  };

  const handleDefault = () => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  };

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        aria-label="basic tabs example"
      >
        <Tab onClick={handleDefault} label="Новые" />
        <Tab onClick={handlePopular} label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsloading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsloading ? (
              <Post key={index} isLoading={isPostsloading} />
            ) : (
              <Post
                id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl
                    ? `${
                        process.env.REACT_APP_API_URL || "http://localhost:5000"
                      }${obj.imageUrl}`
                    : null
                }
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={obj.viewsCount}
                tags={obj.tags}
                isEditable={
                  userData?._id === obj.user._id ||
                  userData?._id === "665784f63acf547628ad918c"
                }
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsloading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: "Вася Пупкин",
                  avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                },
                text: "Это тестовый комментарий",
              },
              {
                user: {
                  fullName: "Иван Иванов",
                  avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                },
                text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
