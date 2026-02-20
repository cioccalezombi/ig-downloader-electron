// config.js
const path = require("path");

module.exports = {
  COOKIES_PATH: path.join(__dirname, "cookies", "www.instagram.com_cookies.txt"),
  OUTPUT_DIR: path.join(__dirname, "downloads")
};
