// renderer.js
const $profile = document.getElementById("profile");
const $go = document.getElementById("go");
const $log = document.getElementById("log");
const dropdown = document.getElementById("modeDropdown");
const selected = dropdown.querySelector(".dropdown-selected");
const options = dropdown.querySelectorAll(".dropdown-options div");

function setLog(msg) {
  $log.textContent = msg;
  $log.scrollTop = $log.scrollHeight;
}

function appendLog(chunk) {
  $log.textContent += chunk;
  $log.scrollTop = $log.scrollHeight;
}

// Recibe log en tiempo real desde main
window.ig.onLog((chunk) => {
  appendLog(chunk);
});

$go.addEventListener("click", async () => {
  const profile = $profile.value.trim();
  const mode = getMode();
  

  setLog("Iniciando...\n");
  $go.disabled = true;

  try {
    const res = await window.ig.download({ profile, mode });
    appendLog("\n\n=== RESULTADO ===\n" + res.message + "\n");
  } catch (e) {
    appendLog("\n\nError inesperado:\n" + (e?.message || String(e)) + "\n");
  } finally {
    $go.disabled = false;
  }
});



let mode = "all";

selected.addEventListener("click", () => {
  dropdown.classList.toggle("open");
});

options.forEach(opt => {
  opt.addEventListener("click", () => {
    mode = opt.dataset.value;
    selected.textContent = opt.textContent;
    dropdown.classList.remove("open");
  });
});

// reemplazar donde antes leías select.value:
function getMode() {
  return mode;
}
