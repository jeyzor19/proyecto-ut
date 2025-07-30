import { loadProjects, saveProjects } from "./storage.js";
import { renderProjects } from "./render.js";
import { openAddModal, closeAddModal } from "./ui.js";
import { toggleObjetivos, agregarObjetivo } from "./form.js";
import { renderProjects } from './render.js';
import renderProjects from './render.js';
import { setupExportButton } from "./exportPdf.js";

window.appProjects = loadProjects();
window.nextId = Math.max(0, ...window.appProjects.map(p => p.id)) + 1;

document.addEventListener("DOMContentLoaded", () => {
  renderProjects();

  document.getElementById("toggleViewButton").addEventListener("click", () => {
    renderProjects(true); // Toggle de vista, puedes manejarlo con una variable
  });

  document.getElementById("projectForm").addEventListener("submit", e => {
    e.preventDefault();

    const nombre = e.target.nombre.value.trim();
    const descripcion = e.target.descripcion.value.trim();
    if (!nombre || !descripcion) return alert("Campos requeridos");

    const nuevoProyecto = {
      id: window.nextId++,
      nombre,
      descripcion,
      objetivos: []
    };

    window.appProjects.push(nuevoProyecto);
    saveProjects(window.appProjects);
    renderProjects();
    closeAddModal();
    e.target.reset();
  });

  document.getElementById("openAddBtn")?.addEventListener("click", openAddModal);
  document.getElementById("toggleObjetivos").addEventListener("change", toggleObjetivos);
  document.getElementById("btnAgregarObjetivo").addEventListener("click", agregarObjetivo);
  document.getElementById("nuevoObjetivo").addEventListener("keypress", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      agregarObjetivo();
    }
  });

  setupExportButton();
});
