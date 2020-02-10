import axios from "axios";
import survey from "./survey"

const API = "https://movie-survey.herokuapp.com";

export default {
  submit: async () => {
    await axios.post(`${API}/submit`, survey.get());
  }
};