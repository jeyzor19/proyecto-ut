let idUsuarioFirmado;
export default async function mostrarProyectos(idUsuario) {
  idUsuarioFirmado = idUsuario;
  try {
    const response = await fetch(
      `http://localhost:3000/api/proyectos/usuario/${idUsuario}`
    );
    if (!response.ok) {
      console.log('error cargando departamentos');
      return;
    }

    const proyectos = await response.json();

    // Crear elementos html - Tarjeta - Card

    const proyectosContainer = document.getElementById('proyectosContainer');
    proyectosContainer.innerHTML = ''; // Limpiar anteriores

    proyectos.forEach((proyecto) => {
      const {
        id: proyectoId,
        nombre,
        descripcion,
        area,
        progreso,
        fecha_creacion,
        visible,
        objetivos,
        creador,
        //encargados, //usuarios
        //objetivos // array de objetivos
      } = proyecto;
      //   console.log('proyecto', proyecto);

      const fecha = new Date(fecha_creacion).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const listaObjetivos =
        objetivos.length > 0
          ? objetivos
              .map(
                (obj) => `
                    <li>
                    <input type="checkbox" 
                    data-id="${obj.id}" ${obj.completado ? 'checked' : ''}>
                    ${obj.descripcion}
                    </li>
                `
              )
              .join('')
          : '<li>No hay objetivos</li>';

      // Crear tarjeta HTML
      const tarjeta = document.createElement('div');
      tarjeta.classList.add('tarjeta-proyecto');

      tarjeta.innerHTML = `
                <div class="contenido-proyecto">
                    <h3>${nombre}</h3>
                    <p class="fecha"><strong>Creado:</strong> ${fecha}</p>
                    <p><strong>Área:</strong> ${area}</p>
                    <p class="descripcion">${descripcion}</p>
                    <p><strong>Objetivos:</strong></p>
                    <ul>${listaObjetivos}</ul>
                    <p><strong>Progreso:</strong> <span class="texto-progreso">${progreso}%</span></p>
                    <div class="barra-progreso" data-id="${proyectoId}">
                        <div class="progreso-interno" style="width: ${progreso}%;"></div>
                    </div>
                </div>
                <div class="acciones-proyecto">
                    <button id="editar-proyecto" data-id="${proyectoId}">Editar</button>
                    <button>+ Bitácora</button>
                    <button>Ver Bitácoras</button>
                    <button onclick="eliminarProyecto(${proyectoId})">Eliminar</button>
                    <button>Completar</button>
                </div>`;

      proyectosContainer.appendChild(tarjeta);

      // 🔽 Agregar después de proyectosContainer.appendChild(tarjeta);
      const botonCompletar = tarjeta.querySelector('button:last-child'); // Último botón es "Completar"

      botonCompletar.addEventListener('click', async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/proyectos/${proyecto.id}/completar`,
            {
              method: 'PUT',
            }
          );

          const data = await response.json();

          if (!response.ok) throw new Error(data.mensaje);

          alert('✅ Proyecto marcado como completado.');
          mostrarProyectos(idUsuario); // Recargar proyectos
        } catch (err) {
          alert(`❌ No se pudo completar el proyecto: ${err.message}`);
        }
      });

      async function eliminarProyecto(idProyecto) {
        const confirmar = confirm('¿Estás seguro de eliminar este proyecto?');
        if (!confirmar) return;

        try {
          const res = await fetch(`/api/proyectos/eliminar/${idProyecto}`, {
            method: 'PUT',
          });

          if (res.ok) {
            alert('Proyecto eliminado correctamente');
            location.reload(); // recargar vista
          } else {
            const data = await res.json();
            alert('Error: ' + data.mensaje);
          }
        } catch (error) {
          console.error(error);
          alert('Error al conectar con el servidor');
        }
      }
      window.eliminarProyecto = eliminarProyecto;

      // Agregar listeners a los checkboxes
      tarjeta
        .querySelectorAll('input[type="checkbox"][data-id]')
        .forEach((checkbox) => {
          checkbox.addEventListener('change', async (e) => {
            const idObjetivo = e.target.dataset.id;
            const completado = e.target.checked;

            try {
              const res = await fetch(
                `http://localhost:3000/api/objetivos/${idObjetivo}`,
                {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ completado }),
                }
              );

              if (!res.ok) throw new Error('Error actualizando objetivo');

              console.log(
                `✔ Objetivo ${idObjetivo} actualizado: ${completado}`
              );

              const tarjetaProyecto = e.target.closest('.tarjeta-proyecto');
              const checkboxes = tarjetaProyecto.querySelectorAll(
                'input[type="checkbox"][data-id]'
              );
              const total = checkboxes.length;
              const completados = [...checkboxes].filter(
                (cb) => cb.checked
              ).length;
              const nuevoProgreso =
                total === 0 ? 0 : Math.round((completados / total) * 100);

              // Actualizar visualmente el progreso
              tarjetaProyecto.querySelector(
                '.texto-progreso'
              ).textContent = `${nuevoProgreso}%`;
              const barra = tarjetaProyecto.querySelector(
                '.barra-progreso .progreso-interno'
              );
              barra.style.width = `${nuevoProgreso}%`;
            } catch (err) {
              console.error(err);
              alert('Error al actualizar objetivo');
              // Revertir visual si falla
              e.target.checked = !completado;
            }
          });
        });
    });
  } catch (error) {
    console.log('Error obteniendo los departamentos', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (ev) => {
    if (ev.target && ev.target.id === 'editar-proyecto') {
      const proyectoId = ev.target.dataset.id;
      console.log(proyectoId);
      console.log(ev);
      console.log(ev.target);
      console.log(ev.target.dataset);
      window.location.href = `editar-proyecto.html?usuarioId=${idUsuarioFirmado}&proyectoId=${proyectoId}`;
    }
  });
});
