import axios from "axios";

const apiCall = (url = "", data = {}, method) => {
  const func = (method === "POST") ? axios.post : axios.get;
  return func(url, data).then(response => {return response.data});
};
const get = url => apiCall(url, {}, "GET");
const post = (...args) => apiCall(...args, "POST");
export default {
  get: function(...args) {
    return get(...args);
  },
  post: function(url, data, flag = false) {
    return post(url, data);
  },
};
