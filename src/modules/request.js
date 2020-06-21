import Axios from "axios";
import store from "../store";
import Logger from "./Logger";
import { isProduction } from "../utils";
import { clone } from "./object";

export const baseUrl = isProduction()
  ? "https://clinax-server.herokuapp.com/"
  : "http://localhost:3000/";

const progressCallbacks = {};

export function addProgressCallback(name, cb) {
  progressCallbacks[name] = cb;
}

export function removeProgressCallback(name) {
  delete progressCallbacks[name];
}

const axios = new Axios.create({
  baseURL: baseUrl,
  onUploadProgress: function (progressEvent) {
    let progress = parseInt(
      Math.round((progressEvent.loaded / progressEvent.total) * 100)
    );

    for (const key in progressCallbacks) {
      if (key in progressCallbacks) {
        const element = progressCallbacks[key];
        element && element(progress, progressEvent);
      }
    }
  },
});

export async function makeRequest(method, model, ...option) {
  var url = model;
  let Authorization = "Bearer " + store.state.token;

  let callback = option[1] || option[0];
  let data = (option[0] instanceof Function ? {} : option[0]) || {};
  let headers = { Authorization };
  var headersToAdd = null,
    queryItems = null;
  if (data instanceof FormData) {
    let id = data.get("id");
    if (id) url += "/" + id;

    data.delete("id");

    let headers = data.get("header");
    headers = headers && JSON.parse(headers);
    if (headers) {
      headersToAdd = headers;
      data.delete("header");
    }

    let query = data.get("query");
    query = query && JSON.parse(query);
    if (query) {
      queryItems = query;
      data.delete("query");
    }
  } else {
    if (data.id) url += "/" + data.id;
    delete data.id;

    if ("header" in data) {
      headersToAdd = clone(data.header);

      delete data.header;
    }

    if ("query" in data) {
      queryItems = clone(data.query);

      delete data.query;
    }
  }

  if (headersToAdd)
    for (const attr in headersToAdd) headers[attr] = headersToAdd[attr];

  if (queryItems) {
    let params = new URLSearchParams();
    for (const key in queryItems) {
      if (key in queryItems) {
        const element = queryItems[key];
        params.append(key, element);
      }
    }

    url += "?" + params.toString();
  }

  let response = await axios({
    headers,
    method,
    url,
    responseType: "json",
    data,
  });

  return typeof callback == "function" ? callback(response) : response;
}

export function errorHandler(err) {
  var message;
  if (err.response && err.response.data) {
    if (err.response.data.error) Logger.l(err.response.data.error);
    Logger.l("Config", err.config);
    message = err.response.data.message;
  } else {
    Logger.l("Error", err);
    message = err.message;
  }
  return message;
}
