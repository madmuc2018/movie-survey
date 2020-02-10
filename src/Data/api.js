import axios from "axios";
import survey from "./survey"

const API = "https://a1091713.ngrok.io";

export default {
  submit: async () => {
    await axios.post(`${API}/submit`, survey.get());
  }
};