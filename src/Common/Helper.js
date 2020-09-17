import dateFormat from "dateformat";
import nl2br from "react-newline-to-break";
const API_ROOT = window.app && window.app.env.API_URL;

const helpers = {
  getUrl() {
    return API_ROOT;
  },

  getCurrentDate() {
    return dateFormat(
      new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate().toLocaleString(),
      "yyyy/mm/dd"
    );
  },
  changeLabelFormat(recieveData) {
    return nl2br(String(recieveData).replace("/", "\n"));
  },
  helper2: function (param1) {},
  helper3: function (param1, param2) {},
};

export default helpers;
