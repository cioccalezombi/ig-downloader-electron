// config.js
const path = require("path");
const { app } = require("electron");

/**
 * En dev: usa carpeta del proyecto (__dirname)
 * En producción (dist): usa una carpeta escribible en userData
 */
function getDataDir() {
  return app.isPackaged
    ? path.join(app.getPath("userData"), "IG-Downloader")
    : __dirname;
}

function getCookiesPath() {
  return path.join(getDataDir(), "cookies", "www.instagram.com_cookies.txt");
}

function getOutputDir() {
  return path.join(app.getPath("desktop"), "IG-Downloader");
}

module.exports = {
  getDataDir,
  getCookiesPath,
  getOutputDir,
};