async function llenarSidebarDepartamentos() {
  const contenedor = document.getElementById('lista-departamentos');
  contenedor.innerHTML = `<li><button class="dep-btn" data-id="">Todos</button></li>`; // opción por defecto

  try {
    const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
    const response = await fetch(`http://localhost:3000/api/departamentos/usuario/${usuarioActual.id}`);
    const departamentos = await response.json();

    departamentos.forEach(dep => {
      const li = document.createElement('li');
      li.innerHTML = `<button class="dep-btn" data-id="${dep.id}">${dep.nombre}</button>`;
      contenedor.appendChild(li);
    });

    contenedor.addEventListener('click', (e) => {
      if (e.target.classList.contains('dep-btn')) {
        const idDep = e.target.getAttribute('data-id');
        filtrarProyectosPorDepartamento(idDep); // Esta función la definiremos después
      }
    });
  } catch (err) {
    console.error('Error al cargar departamentos del usuario', err);
  }
}




async function filtrarProyectosPorDepartamento(idDepartamento) {
  const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
  if (!usuarioActual) return;

  try {
    const response = await fetch(
      `http://localhost:3000/api/proyectos/usuario/${usuarioActual.id}`
    );

    if (!response.ok) throw new Error('Error al obtener proyectos');

    const todosProyectos = await response.json();

    const proyectosFiltrados = idDepartamento
      ? todosProyectos.filter(p => p.id_departamento == idDepartamento)
      : todosProyectos;

    // Llamamos a una función para renderizar los proyectos filtrados
    renderizarProyectos(proyectosFiltrados, usuarioActual.id);
  } catch (error) {
    console.error('Error al filtrar proyectos', error);
  }
}

function renderizarProyectos(proyectos, idUsuario) {
    const proyectosContainer = document.getElementById('proyectosContainer');
    proyectosContainer.innerHTML = ''; // Limpiar proyectos anteriores

    proyectos.forEach(proyecto => {
        const {
            nombre,
            descripcion,
            area,
            progreso,
            fecha_creacion,
            visible,
            encargados,
            objetivos,
            creador
        } = proyecto;

        const listaEncargados = encargados.map(enc => `${enc.nombre} ${enc.apellidos}`).join(', ') || 'Sin asignar';

        const fecha = new Date(fecha_creacion).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const listaObjetivos = objetivos.length > 0
            ? objetivos.map(obj => `
                <li>
                    <input type="checkbox" 
                    data-id="${obj.id}" ${obj.completado ? 'checked' : ''}>
                    ${obj.descripcion}
                </li>
            `).join('')
            : '<li>No hay objetivos</li>';

        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-proyecto');

        tarjeta.innerHTML = `
        <div class="contenido-proyecto">
            <h3>${nombre}</h3>
            <p class="fecha"><strong>Creado:</strong> ${fecha}</p>
            <p><strong>Área:</strong> ${area}</p>
            <p><strong>Encargado(s):</strong> ${listaEncargados}</p>
            <p class="descripcion">${descripcion}</p>
            <p><strong>Objetivos:</strong></p>
            <ul>${listaObjetivos}</ul>
            <p><strong>Progreso:</strong> <span class="texto-progreso">${progreso}%</span></p>
            <div class="barra-progreso" data-id="${proyecto.id}">
                <div class="progreso-interno" style="width: ${progreso}%;"></div>
            </div>
        </div>
        <div class="acciones-proyecto">
            <button>Editar</button>
            <button>+ Bitácora</button>
            <button>Ver Bitácoras</button>
            <button onclick="eliminarProyecto(${proyecto.id})">Eliminar</button>
            <button>Completar</button>
        </div>
        `;

        proyectosContainer.appendChild(tarjeta);

        // Botón completar
        const botonCompletar = tarjeta.querySelector('button:last-child');
        botonCompletar.addEventListener('click', async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/proyectos/${proyecto.id}/completar`, {
                    method: 'PUT',
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.mensaje);

                alert('✅ Proyecto marcado como completado.');
                filtrarProyectosPorDepartamento('');  // Recargar todos los proyectos
            } catch (err) {
                alert(`❌ No se pudo completar el proyecto: ${err.message}`);
            }
        });

        // Función eliminar global
        async function eliminarProyecto(idProyecto) {
            const confirmar = confirm('¿Estás seguro de eliminar este proyecto?');
            if (!confirmar) return;

            try {
                const res = await fetch(`/api/proyectos/eliminar/${idProyecto}`, { method: 'PUT' });

                if (res.ok) {
                    alert('Proyecto eliminado correctamente');
                    location.reload();
                } else {
                    const data = await res.json();
                    alert('Error: ' + data.mensaje);
                }
            } catch (error) {
                console.error(error);
                alert('Error al conectar con el servidor');
            }
        }

        //window.eliminarProyecto = eliminarProyecto;

        // Checkbox de objetivos
        tarjeta.querySelectorAll('input[type="checkbox"][data-id]').forEach(checkbox => {
            checkbox.addEventListener('change', async (e) => {
                const idObjetivo = e.target.dataset.id;
                const completado = e.target.checked;

                try {
                    const res = await fetch(`http://localhost:3000/api/objetivos/${idObjetivo}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ completado }),
                    });

                    if (!res.ok) throw new Error('Error actualizando objetivo');

                    const tarjetaProyecto = e.target.closest('.tarjeta-proyecto');
                    const checkboxes = tarjetaProyecto.querySelectorAll('input[type="checkbox"][data-id]');
                    const total = checkboxes.length;
                    const completados = [...checkboxes].filter(cb => cb.checked).length;
                    const nuevoProgreso = total === 0 ? 0 : Math.round((completados / total) * 100);

                    tarjetaProyecto.querySelector('.texto-progreso').textContent = `${nuevoProgreso}%`;
                    tarjetaProyecto.querySelector('.barra-progreso .progreso-interno').style.width = `${nuevoProgreso}%`;
                } catch (err) {
                    console.error(err);
                    alert('Error al actualizar objetivo');
                    e.target.checked = !completado;
                }
            });
        });

    });
}



export { llenarSidebarDepartamentos, filtrarProyectosPorDepartamento };
