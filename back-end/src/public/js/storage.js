export const PROJECTS_KEY = "proyectos";

export function loadProjects() {
  try {
    return JSON.parse(localStorage.getItem(PROJECTS_KEY)) || [];
  } catch (e) {
    console.warn("Datos corruptos, reiniciando localStorage.");
    localStorage.removeItem(PROJECTS_KEY);
    return [];
  }
}

export function saveProjects(projects) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

function calcularProgreso(proyecto) {
  if (!proyecto.objetivos || proyecto.objetivos.length === 0) {
    return 0;
  }
  const total = proyecto.objetivos.length;
  const completados = proyecto.objetivos.filter(o => o.completado).length;
  return Math.round((completados / total) * 100);
}
