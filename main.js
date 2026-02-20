// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const { getCookiesPath, getOutputDir, getDataDir } = require("./config");

function createWindow() {
  const win = new BrowserWindow({
    width: 520,
    height: 800,
    resizable: false,
    autoHideMenuBar: true,
    menuBarVisible: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Ejecuta gallery-dl (con log en tiempo real)
ipcMain.handle("download", async (event, { profile, mode }) => {
  const clean = (profile || "").trim().replace(/^@/, "");
  if (!clean) return { ok: false, message: "Escribí un nombre de perfil." };

  if (!/^[a-zA-Z0-9._]+$/.test(clean)) {
    return {
      ok: false,
      message: "Nombre inválido. Usá letras, números, punto o guión bajo.",
    };
  }

  // ✅ Rutas correctas según dev vs dist
  const DATA_DIR = getDataDir();
  const COOKIES_PATH = getCookiesPath();
  const OUTPUT_DIR = getOutputDir();

  // ✅ Asegurar carpetas escribibles (en dist NO usar __dirname/app.asar)
  fs.mkdirSync(path.join(DATA_DIR, "cookies"), { recursive: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  if (!fs.existsSync(COOKIES_PATH)) {
    return {
      ok: false,
      message:
        `No encuentro cookies en:\n${COOKIES_PATH}\n\n` +
        `Tip: colocá el archivo www.instagram.com_cookies.txt dentro de:\n` +
        `${path.join(DATA_DIR, "cookies")}`,
    };
  }

  // ✅ carpeta por usuario
  const userDir = path.join(OUTPUT_DIR, clean);
  fs.mkdirSync(userDir, { recursive: true });

  const url = `https://www.instagram.com/${clean}/`;

  const args = ["--cookies", COOKIES_PATH, "-D", userDir];

  // ✅ filtros robustos (IG a veces sirve webp / m4v)
  if (mode === "photos") args.push("--filter", "extension in ('jpg','jpeg','png','webp')");
  if (mode === "videos") args.push("--filter", "extension in ('mp4','m4v')");

  args.push(url);

  event.sender.send("download:log", `> gallery-dl ${args.join(" ")}\n\n`);
  event.sender.send("download:log", `[DATA_DIR] ${DATA_DIR}\n`);
  event.sender.send("download:log", `[COOKIES] ${COOKIES_PATH}\n`);
  event.sender.send("download:log", `[OUTPUT ] ${OUTPUT_DIR}\n\n`);

  return await new Promise((resolve) => {
    // ✅ IMPORTANTE: sin shell para que Windows no rompa el --filter
    const proc = spawn("gallery-dl", args, { shell: false, windowsHide: true });

    proc.stdout.on("data", (d) => event.sender.send("download:log", d.toString()));
    proc.stderr.on("data", (d) => event.sender.send("download:log", d.toString()));

    proc.on("close", (code) => {
      const ok = code === 0 || code === 64;

      if (ok) {
        event.sender.send("download:log", `\n\n[FIN] Exit code ${code}\n`);
        resolve({ ok: true, message: `Listo ✅\nGuardado en:\n${userDir}` });
      } else {
        event.sender.send("download:log", `\n\n[ERROR] Exit code ${code}\n`);
        resolve({
          ok: false,
          message:
            `Falló (code ${code}).\n\n` +
            `Tip: re-exportá cookies si Instagram te corta la sesión.\n\n` +
            `Guardado en:\n${userDir}`,
        });
      }
    });
  });
});