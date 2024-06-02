import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
});

// Прикрепление к Bearer токена (при каждом
// запросе будет отправляться токен автоматически)

instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem("token");

  return config;
});

export default instance;
