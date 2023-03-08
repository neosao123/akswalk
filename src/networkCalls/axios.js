import axios from "axios";
import strings from "../utils/strings";
const BASE_URL = strings.API_ROUTE;
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
});
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});
