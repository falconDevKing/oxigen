import axios, { Axios } from "axios";

const baseUrl = process.env.BASE_URL;
const apiKey = process.env.API_KEY;
const siteId = process.env.SITE_ID;

const AxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json", "API-Key": apiKey, siteId: siteId },
});

export default AxiosInstance;
