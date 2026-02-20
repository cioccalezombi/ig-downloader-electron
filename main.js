// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const { COOKIES_PATH, OUTPUT_DIR } = require("./config");

function createWindow() {
  const win = new BrowserWindow({
    width: 520,
    height: 800,
    resizable: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    autoHideMenuBar: true,
    menuBarVisible: false,
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

  if (!fs.existsSync(COOKIES_PATH)) {
    return { ok: false, message: `No encuentro cookies en:\n${COOKIES_PATH}` };
  }

  const path = require("path"); // (si no está ya arriba del main.js)

  const url = `https://www.instagram.com/${clean}/`;
  const userDir = path.join(OUTPUT_DIR, clean);
  fs.mkdirSync(userDir, { recursive: true });
  const args = ["--cookies", COOKIES_PATH, "-D", userDir];
  if (mode === "photos")
    args.push(
      "--filter",
      "extension == 'jpg' || extension == 'jpeg' || extension == 'png'",
    );
  if (mode === "videos") args.push("--filter", "extension == 'mp4'");

  args.push(url);

  event.sender.send("download:log", `> gallery-dl ${args.join(" ")}\n\n`);

  return await new Promise((resolve) => {
    const proc = spawn("gallery-dl", args, { shell: true });

    proc.stdout.on("data", (d) =>
      event.sender.send("download:log", d.toString()),
    );
    proc.stderr.on("data", (d) =>
      event.sender.send("download:log", d.toString()),
    );

    proc.on("close", (code) => {
      // Tratamos 0 y 64 como OK
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
            `Tip: abrí Instagram en el navegador, asegurate de estar logueado, re-exportá cookies.\n\n` +
            `Guardado en:\n${userDir}`,
        });
      }
    });
  });
});
