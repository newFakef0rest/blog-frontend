import React from "react";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import axios from "../../axios";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [text, setText] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [isTitleReady, setIsTitleReady] = React.useState(true);
  const [isTagsReady, setIsTagsReady] = React.useState(true);

  const handleBlur = ({ onChange, item }) => {
    if (item.length < 3 && item != tags) {
      onChange(false);
    } else if (item.trim().length < 1) {
      onChange(false);
    } else {
      onChange(true);
    }
  };

  const isReady =
    isTitleReady && isTagsReady && text.length > 10 ? true : false;

  const isEditing = Boolean(id);

  const inputRef = React.useRef(null);

  const isAuth = useSelector(selectIsAuth);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (err) {
      console.error(err);
    }
  };

  const onClickRemoveImage = async () => {
    try {
      await axios.delete("/upload", {
        data: {
          url: imageUrl,
        },
      });
      setImageUrl("");
    } catch (err) {
      console.error(err);
    }
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      const fields = {
        title,
        tags: tags.split(" "),
        imageUrl,
        text,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...(минимум 10 символов)",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  React.useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then((res) => {
          setTitle(res.data.title);
          setText(res.data.text);
          setImageUrl(res.data.imageUrl);
          setTags(res.data.tags.join(" "));
        })
        .catch((err) => {
          console.err(err);
        });
    }
  }, [id]);

  if (!isAuth && !window.localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input ref={inputRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`${
              process.env.REACT_APP_API_URL || "http://localhost:5000"
            }${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={!isTitleReady}
        onBlur={() => handleBlur({ onChange: setIsTitleReady, item: title })}
        helperText={
          isTitleReady === false
            ? "Заголовок должен содержать минимум 3 символа"
            : ""
        }
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        onBlur={() => handleBlur({ onChange: setIsTagsReady, item: tags })}
        error={!isTagsReady}
        helperText={
          isTagsReady === false ? "Тэги должны иметь минимум один символ" : ""
        }
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button
          disabled={!isReady}
          onClick={onSubmit}
          size="large"
          variant="contained"
        >
          {isEditing ? "Изменить" : "Опубликовать"}
        </Button>
        <Link to="/">
          <Button size="large">Отмена</Button>
        </Link>
      </div>
    </Paper>
  );
};
