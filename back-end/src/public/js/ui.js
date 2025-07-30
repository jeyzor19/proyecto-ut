export function openModal(id) {
  const project = window.appProjects.find(p => p.id === id);
  if (!project) return;
  window.currentProject = project;

  const md = document.getElementById("modalDetails");
  md.innerHTML = `<h2>${project.nombre}</h2><p>${project.descripcion}</p>`;
  document.getElementById("projectModal").classList.remove("hidden");
}

export function closeModal() {
  document.getElementById("projectModal").classList.add("hidden");
  window.currentProject = null;
}

export function openAddModal() {
  document.getElementById("addProjectModal").classList.remove("hidden");
}

export function closeAddModal() {
  document.getElementById("addProjectModal").classList.add("hidden");
}

export function openReportModal() {
  document.getElementById("reportModal").classList.remove("hidden");
}

export function closeReportModal() {
  document.getElementById("reportModal").classList.add("hidden");
}
