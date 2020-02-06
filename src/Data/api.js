import axios from "axios";

const API = "https://a1091713.ngrok.io";

export default {
  submit: async data => {
    await axios.post(`${API}/submit`, data);
  }
};