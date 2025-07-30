function actualizarListaProyectos() {
  const grid = document.querySelector('.card-grid');
  grid.innerHTML = ''; // Limpiar la lista antes de renderizar

  // Validar si existen proyectos
  if (!proyectos || proyectos.length === 0) {
    grid.innerHTML = '<p>No hay proyectos creados aún.</p>';
    return;
  }

  // Iterar sobre cada proyecto para crear sus tarjetas
  proyectos.forEach((proyecto, index) => {
    // Obtener progreso, por defecto 0 si no está definido
    const progreso = proyecto.progreso || 0;

    // Crear elemento tarjeta
    const card = document.createElement('div');
    card.classList.add('card');

    // Definir contenido HTML de la tarjeta
    card.innerHTML = `
      <h3>${proyecto.nombre}</h3>
      <p>${proyecto.descripcion}</p>

      <div class="progress-bar" aria-label="Progreso del proyecto ${proyecto.nombre}">
        <div class="progress-bar-inner" style="width: ${progreso}%;"></div>
      </div>
      <div class="progress-text">${progreso}% completado</div>

      <button onclick="verProyecto(${index})">Ver</button>
    `;

    // Añadir la tarjeta al grid
    grid.appendChild(card);
  });
}

// Exportar la función renderProjects (asumiendo que quieres implementar o usar esta función)
export function renderProjects() {
  // Implementación pendiente o llamada a actualizarListaProyectos
  actualizarListaProyectos();
}
