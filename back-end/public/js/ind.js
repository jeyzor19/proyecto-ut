// ind.js
document.addEventListener('DOMContentLoaded', () => {
  try {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  
  if (
    !usuario ||
    typeof usuario.id !== 'number' || // verifica que sea un número válido
    !usuario.nombre ||
    !usuario.rol ||
    usuario.rol === ''
  ) {
    throw new Error("Sesión inválida o incompleta");
  }

  console.log(`Sesión activa: ${usuario.nombre} (${usuario.rol})`);
  
  } catch (error) {
    console.warn("Redirigiendo por sesión inválida:", error.message);
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
  }
});

document.addEventListener('DOMContentLoaded', () => {
  window.proyectos = [];
  let vistaGrid = true;

  const dashboard = document.getElementById('dashboard');
  const toggleViewBtn = document.getElementById('toggleViewButton');
  const form = document.getElementById('projectForm');
  const btnProyectosEliminados = document.getElementById('btnProyectosEliminados');

  toggleViewBtn.addEventListener('click', () => {
    vistaGrid = !vistaGrid;
    dashboard.classList.toggle('list-view', !vistaGrid);
    renderProyectos();
  });

  btnProyectosEliminados?.addEventListener('click', () => {
    mostrarModalEliminados();
  });

  document.getElementById('btnNuevoProyecto').addEventListener('click', () => {
    document.getElementById('addProjectModal').classList.remove('hidden');
  });

  document.getElementById('toggleObjetivos').addEventListener('change', (e) => {
    document.getElementById('seccionObjetivos').classList.toggle('hidden', !e.target.checked);
  });


  form.addEventListener('submit',async function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const area = document.getElementById('area').value;
    const descripcion = document.getElementById('descripcion').value;
    const tieneObjetivos = document.getElementById('toggleObjetivos').checked;
    const objetivosInputs = document.querySelectorAll('.objetivo-input');
    const objetivos = Array.from(objetivosInputs).map(input => ({ texto: input.value, cumplido: false }));
    const encargados = Array.from(document.querySelectorAll('#encargadosSeleccionados span')).map(e => parseInt(e.dataset.id));
    const usuarioActual = JSON.parse(localStorage.getItem("usuario"));
    const departamentoSeleccionadoId = document.getElementById("filtro-departamento").value;


    const editingId = form.dataset.editingId;
    if (editingId) {
      const proyecto = window.proyectos.find(p => p.id == editingId);
      if (proyecto) {
        proyecto.nombre = nombre;
        proyecto.area = area;
        proyecto.descripcion = descripcion;
        proyecto.encargados = encargados;
        proyecto.tieneObjetivos = tieneObjetivos;
        proyecto.objetivos = tieneObjetivos ? objetivos : [];
        proyecto.completado = tieneObjetivos ? proyecto.completado : false;
      }
    } else {
  // Objeto que se enviará al backend
      const proyecto = {
        nombre,
        area,
        descripcion,
        id_creador: usuarioActual.id, // 👈 esto viene de localStorage normalmente
        id_departamento: departamentoSeleccionadoId, // 👈 obtenido del <select>
        encargados, // arreglo de ID de usuarios
        tieneObjetivos,
        objetivos: tieneObjetivos ? objetivos : []
      };

      try {
        const response = await fetch("http://localhost:3000/api/proyectos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(proyecto)
        });

        const data = await response.json();

        if (response.ok) {
          alert("✅ Proyecto creado correctamente.");
          form.reset();
          cerrarModalProyecto(); // asegúrate de tener esta función definida
        } else {
          alert("❌ Error al crear proyecto: " + data.mensaje);
        }

      } catch (error) {
        console.error("Error en fetch:", error);
        alert("❌ Error de conexión al servidor.");
      }
    }

    async function cargarEncargadosPorDepartamento(idDep) {
      try {
        const response = await fetch(`http://localhost:3000/api/usuarios/departamento/${idDep}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.mensaje || "Error al obtener encargados");

        const listaContenedor = document.getElementById("lista-encargados");
        listaContenedor.innerHTML = ""; // limpia

        data.forEach(usuario => {
          const div = document.createElement("div");
          div.innerHTML = `
            <label>
              <input type="checkbox" data-id="${usuario.id}" />
              ${usuario.nombre}
            </label>
          `;
          listaContenedor.appendChild(div);
        });

      } catch (error) {
        console.error("Error al cargar encargados:", error);
        alert("❌ No se pudieron cargar los encargados.");
      }
    }


    renderProyectos();
    document.getElementById('addProjectModal').classList.add('hidden');
    form.reset();
    document.getElementById('objetivosContainer').innerHTML = '<input type="text" class="objetivo-input" placeholder="Escribe un objetivo" required>';
    document.getElementById('toggleObjetivos').checked = false;
    document.getElementById('seccionObjetivos').classList.add('hidden');
    document.getElementById('encargadosSeleccionados').innerHTML = '';
    delete form.dataset.editingId;
    document.querySelector("#addProjectModal h2").textContent = "Crear Nuevo Proyecto";
    document.querySelector("#projectForm button[type='submit']").textContent = "Crear Proyecto";
  });


  
  function renderProyectos() {
    dashboard.innerHTML = '';
    proyectos.filter(p => !p.eliminado).forEach(proyecto => {
      const card = document.createElement('div');
      card.className = 'card';

      const progreso = proyecto.tieneObjetivos ?
        Math.round((proyecto.objetivos.filter(o => o.cumplido).length / proyecto.objetivos.length) * 100) :
        proyecto.completado ? 100 : 0;

      card.innerHTML = `
        <div class="card-body">
          <div class="contenido-scrollable">
            <h3>${proyecto.nombre}</h3>
            <p><strong>Área:</strong> ${proyecto.area}</p>
            <p>${proyecto.descripcion}</p>
            <p><strong>Encargados:</strong> ${proyecto.encargados.join(', ')}</p>
            ${proyecto.tieneObjetivos ? `<ul>
              ${proyecto.objetivos.map((obj, i) => `
                <li>
                  <label>
                    <input type="checkbox" data-id="${proyecto.id}" data-obj-index="${i}" ${obj.cumplido ? 'checked' : ''}>
                    ${obj.texto}
                  </label>
                </li>`).join('')}
            </ul>` : ''}
            <div class="progress-bar"><div class="progress-fill" style="width:${progreso}%"></div></div>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn-secundario" onclick="editarProyecto(${proyecto.id})">Editar</button>
          <button class="btn-secundario" onclick="abrirModalBitacora(${proyecto.id})">+ Bitácora</button>
          <button class="btn-secundario" onclick="verBitacoras(${proyecto.id})">Ver Bitácoras</button>
          <button class="btn-secundario" onclick="eliminarProyecto(${proyecto.id})">Eliminar</button>
          <button class="complete-button" onclick="completarProyecto(${proyecto.id})">Completar</button>
        </div>
      `;



      dashboard.appendChild(card);
    });
    agregarListenersCheckbox();
  }

  window.editarProyecto = function (id) {
    const proyecto = window.proyectos?.find(p => p.id === id);
    if (proyecto) {
      window.loadProyectoParaEdicion(proyecto);
    }
  };

  function agregarListenersCheckbox() {
    document.querySelectorAll('input[type="checkbox"]').forEach(chk => {
      chk.addEventListener('change', () => {
        const id = parseInt(chk.dataset.id);
        const index = parseInt(chk.dataset.objIndex);
        const proyecto = proyectos.find(p => p.id === id);
        if (proyecto) {
          proyecto.objetivos[index].cumplido = chk.checked;

          // Actualiza visualmente solo la barra de progreso
          const completados = proyecto.objetivos.filter(o => o.cumplido).length;
          const progreso = Math.round((completados / proyecto.objetivos.length) * 100);
          const card = chk.closest('.card');
          const fill = card.querySelector('.progress-fill');
          fill.style.width = `${progreso}%`;
        }
      });
    });
  } 

  const filtroDepartamento = document.getElementById("filtro-departamento");

  if (filtroDepartamento) {
    filtroDepartamento.addEventListener("change", async () => {
      const departamentoSeleccionadoId = filtroDepartamento.value;
      await cargarEncargadosPorDepartamento(departamentoSeleccionadoId);
    });
  }


    window.eliminarProyecto = function(id) {
    const proyecto = proyectos.find(p => p.id === id);
    if (proyecto) {
      proyecto.eliminado = true;
      renderProyectos();
    }
  };

  window.mostrarModalEliminados = function() {
    const modal = document.getElementById('modalEliminados');
    const lista = document.getElementById('listaEliminados');
    lista.innerHTML = '';

    const eliminados = proyectos.filter(p => p.eliminado);
    if (eliminados.length > 0) {
      eliminados.forEach(p => {
        const div = document.createElement('div');
        div.className = 'bitacora-item';
        div.innerHTML = `
          <h4>${p.nombre}</h4>
          <p><strong>Área:</strong> ${p.area}</p>
          <p><strong>Encargados:</strong> ${p.encargados.join(', ')}</p>
          <p>${p.descripcion}</p>
          <button class="btn-secundario" onclick="reactivarProyecto(${p.id})">Reactivar</button>
          <hr>
        `;
        lista.appendChild(div);
      });
    } else {
      lista.innerHTML = '<p>No hay proyectos eliminados.</p>';
    }

    modal.classList.remove('hidden');
  };

  window.reactivarProyecto = function(id) {
    const proyecto = proyectos.find(p => p.id === id);
    if (proyecto) {
      proyecto.eliminado = false;
      document.getElementById('modalEliminados').classList.add('hidden');
      renderProyectos();
    }
  };

  document.getElementById('btnCerrarEliminados')?.addEventListener('click', () => {
    document.getElementById('modalEliminados').classList.add('hidden');
  });

  window.completarProyecto = function(id) {
    const proyecto = proyectos.find(p => p.id === id);
    if (proyecto) {
      proyecto.completado = true;
      proyecto.objetivos.forEach(obj => obj.cumplido = true);

      // Buscar la tarjeta en el DOM
      const card = document.querySelector(`input[data-id="${id}"]`)?.closest('.card');
      if (!card) return;

      // Actualizar checkboxes manualmente
      card.querySelectorAll('input[type="checkbox"]').forEach(chk => {
        chk.checked = true;
      });

      // Actualizar la barra de progreso
      const progreso = 100;
      const fill = card.querySelector('.progress-fill');
      if (fill) fill.style.width = `${progreso}%`;
    }
  };


  window.abrirModalBitacora = function(id) {
    const modal = document.getElementById('modalBitacora');
    modal.classList.remove('hidden');
    modal.dataset.proyectoId = id;
    document.getElementById('tituloBitacora').value = '';
    document.getElementById('descripcionBitacora').value = '';
  };

  document.getElementById('btnCancelarBitacora')?.addEventListener('click', () => {
    document.getElementById('modalBitacora').classList.add('hidden');
  });

  document.getElementById('formBitacora')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById('modalBitacora').dataset.proyectoId);
    const titulo = document.getElementById('tituloBitacora').value;
    const descripcion = document.getElementById('descripcionBitacora').value;
    const proyecto = proyectos.find(p => p.id === id);
    if (proyecto) {
      proyecto.bitacoras.push({
        titulo,
        descripcion,
        autor: 'UsuarioActual',
        fecha: new Date().toISOString()
      });
    }
    document.getElementById('modalBitacora').classList.add('hidden');
  });

  window.verBitacoras = function(id) {
    const proyecto = proyectos.find(p => p.id === id);
    const modal = document.getElementById('modalVerBitacoras');
    const lista = document.getElementById('listaBitacoras');
    lista.innerHTML = '';

    if (proyecto && proyecto.bitacoras.length > 0) {
      proyecto.bitacoras.forEach(b => {
        const div = document.createElement('div');
        div.className = 'bitacora-item';
        div.innerHTML = `
          <h4>${b.titulo}</h4>
          <p><strong>Fecha:</strong> ${new Date(b.fecha).toLocaleString()}</p>
          <p><strong>Autor:</strong> ${b.autor}</p>
          <p>${b.descripcion}</p>
          <hr>
        `;
        lista.appendChild(div);
      });
    } else {
      lista.innerHTML = '<p>No hay bitácoras disponibles para este proyecto.</p>';
    }

    modal.classList.remove('hidden');
  };

  document.getElementById('btnCerrarVerBitacoras')?.addEventListener('click', () => {
    document.getElementById('modalVerBitacoras').classList.add('hidden');
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.href = "login.html";
    });
  }

  // Solo validamos si hay sesión (sin validar rol)
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    window.location.href = "login.html";
  }
});




