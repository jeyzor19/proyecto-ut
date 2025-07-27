let usuariosCargados = []; // Para búsqueda y filtros dinámicos
let paginaActual = 1;
const usuariosPorPagina = 10;

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('dashboardusuarios.html')) {
    fetch('http://localhost:3000/api/usuarios')
      .then(res => res.json())
      .then(data => {
        usuariosCargados = data;
        mostrarUsuariosFiltrados();
        cargarFiltrosDinamicos();
      })
      .catch(err => console.error('Error al cargar usuarios:', err));
  }
});

function mostrarUsuarios(usuarios) {
  const main = document.querySelector('.main-content');
  const inicio = (paginaActual - 1) * usuariosPorPagina;
  const fin = inicio + usuariosPorPagina;
  const usuariosPagina = usuarios.slice(inicio, fin);
  // 🔴 Eliminar cualquier tabla previa
  const tablaExistente = main.querySelector('.tabla-contenedor');
  if (tablaExistente) {
    main.removeChild(tablaExistente);
  }

  // 🟢 Crear nuevo contenedor
  const contenedorTabla = document.createElement('div');
  contenedorTabla.className = 'tabla-contenedor';

  if (usuarios.length === 0) {
    const mensaje = document.createElement('p');
    mensaje.textContent = 'Sin coincidencias';
    mensaje.style.textAlign = 'center';
    mensaje.style.marginTop = '2rem';
    mensaje.style.fontSize = '1.1rem';
    mensaje.style.color = '#555';
    contenedorTabla.appendChild(mensaje);
    main.appendChild(contenedorTabla);
    return;
  }


  const tabla = document.createElement('table');
  tabla.className = 'styled-table';
  tabla.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Correo</th>
        <th>Rol</th>
        <th>Departamentos</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      ${usuariosPagina.map(user => `
        <tr>
          <td>${user.id}</td>
          <td>${user.nombre} ${user.apellidos}</td>
          <td>${user.correo}</td>
          <td>${user.rol?.nombre || 'Sin rol'}</td>
          <td>${user.departamentos.map(dep => dep.nombre).join(', ')}</td>
          <td>
            <div class="accion-botones">
              <button onclick="mostrarModalRol(${user.id})" title="Cambiar rol del usuario">Rol</button>
              <button onclick="mostrarModalDepartamentos(${user.id})" title="Asignar departamento(s)">Deptartamentos</button>
              <button class="delete-btn" onclick="confirmarBajaUsuario(${user.id})" title="Eliminar usuario">Eliminar usuario</button>
            </div>
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;

  contenedorTabla.appendChild(tabla);
  main.appendChild(contenedorTabla);
  agregarControlesPaginacion(usuarios.length);
}
//Funcion eliminar usuarios.
function confirmarBajaUsuario(idUsuario) {
  if (confirm("¿Estás seguro de que deseas dar de baja este usuario? Esta acción no se puede deshacer.")) {
    fetch(`http://localhost:3000/api/usuarios/${idUsuario}`, {
      method: 'DELETE'
    })
    .then(res => {
      if (!res.ok) throw new Error('Error al eliminar usuario');
      // Eliminamos localmente también
      usuariosCargados = usuariosCargados.filter(u => u.id !== idUsuario);
      const totalPaginas = Math.ceil(usuariosCargados.length / usuariosPorPagina);
      if (paginaActual > totalPaginas) {
        paginaActual = totalPaginas || 1; // volver a la última disponible, o a la 1 si no hay usuarios
      }
      mostrarUsuariosFiltrados();
      mostrarToast('🗑️ Usuario eliminado correctamente');
    })
    .catch(err => {
      console.error("Error al eliminar:", err);
      mostrarToast('❌ Error al eliminar usuario');
    });
  }
}



function agregarControlesPaginacion(totalUsuarios) {
  const main = document.querySelector('.main-content');
  
  // Eliminar controles existentes
  const existente = document.querySelector('.paginacion');
  if (existente) existente.remove();

  const totalPaginas = Math.ceil(totalUsuarios / usuariosPorPagina);

  if (totalPaginas <= 1) return; // no mostrar si no se necesita

  const paginacion = document.createElement('div');
  paginacion.className = 'paginacion';

  const btnAnterior = document.createElement('button');
  btnAnterior.textContent = '⏮ Anterior';
  btnAnterior.disabled = paginaActual === 1;
  btnAnterior.onclick = () => {
    paginaActual--;
    mostrarUsuariosFiltrados();
  };

  const indicador = document.createElement('span');
  indicador.textContent = `Página ${paginaActual} de ${totalPaginas}`;

  const btnSiguiente = document.createElement('button');
  btnSiguiente.textContent = 'Siguiente ⏭';
  btnSiguiente.disabled = paginaActual === totalPaginas;
  btnSiguiente.onclick = () => {
    paginaActual++;
    mostrarUsuariosFiltrados();
  };

  paginacion.appendChild(btnAnterior);
  paginacion.appendChild(indicador);
  paginacion.appendChild(btnSiguiente);

  main.appendChild(paginacion);
}


let usuarioActualId = null;

function mostrarModalRol(idUsuario) {
  usuarioActualId = idUsuario;
  fetch('http://localhost:3000/api/roles')
    .then(res => res.json())
    .then(roles => {
      const select = document.getElementById('selectRol');
      select.innerHTML = '';
      roles.forEach(rol => {
        const option = document.createElement('option');
        option.value = rol.id;
        option.textContent = rol.nombre;
        select.appendChild(option);
      });
      document.getElementById('modalRol').classList.remove('hidden');
    });
}

function guardarRol() {
  const idRol = document.getElementById('selectRol').value;

  fetch(`http://localhost:3000/api/usuarios/${usuarioActualId}/rol`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_rol: idRol })
  })
  .then(() => {
    // Actualizamos el rol localmente
    const usuario = usuariosCargados.find(u => u.id === usuarioActualId);
    const select = document.getElementById('selectRol');
    if (usuario && select) {
      usuario.rol = { id: parseInt(idRol), nombre: select.options[select.selectedIndex].textContent };
    }

    cerrarModal('modalRol');
    mostrarUsuariosFiltrados(); // 🔄 Volver a mostrar tabla con cambios
    mostrarToast('✅ Rol actualizado correctamente');
  })
  .catch(err => console.error("Error al guardar rol:", err));
}


function mostrarModalDepartamentos(idUsuario) {
  usuarioActualId = idUsuario;

  Promise.all([
    fetch('http://localhost:3000/api/departamentos').then(res => res.json()),
    fetch(`http://localhost:3000/api/usuarios/${idUsuario}/departamentos`).then(res => res.json())
  ])
  .then(([todosDepartamentos, asignados]) => {
    const idsAsignados = asignados.map(dep => dep.id);
    const contenedor = document.getElementById('listaDepartamentos');
    contenedor.innerHTML = '';

    todosDepartamentos.forEach(dep => {
      const checked = idsAsignados.includes(dep.id) ? 'checked' : '';
      contenedor.innerHTML += `
        <label>
          <input type="checkbox" value="${dep.id}" ${checked} />
          ${dep.nombre}
        </label><br>
      `;
    });

    // ✅ Ahora que todo está listo, mostramos el modal
    document.getElementById('modalDepartamentos').classList.remove('hidden');
  })
  .catch(err => {
    console.error('Error al cargar departamentos:', err);
  });
}




function guardarDepartamentos() {
  const seleccionados = [...document.querySelectorAll('#listaDepartamentos input:checked')].map(cb => parseInt(cb.value));
  fetch(`http://localhost:3000/api/usuarios/${usuarioActualId}/departamentos`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ departamentos: seleccionados })
  }).then(() => {
  const usuario = usuariosCargados.find(u => u.id === usuarioActualId);
  const seleccionados = [...document.querySelectorAll('#listaDepartamentos input:checked')];
  if (usuario) {
    usuario.departamentos = seleccionados.map(cb => ({
      id: parseInt(cb.value),
      nombre: cb.nextSibling.textContent.trim()
    }));
  }
  cerrarModal('modalDepartamentos');
  mostrarUsuariosFiltrados();
  mostrarToast('✅ Departamentos actualizados');
})
}

function cerrarModal(id) {
  document.getElementById(id).classList.add('hidden');
}

document.addEventListener("DOMContentLoaded", () => {
  const selectRoles = document.getElementById("selectRoles");

  if (selectRoles) {
    fetch("http://localhost:3000/api/roles")
      .then(response => {
        if (!response.ok) throw new Error("Error al obtener roles");
        return response.json();
      })
      .then(data => {
        // Limpiar opciones anteriores
        selectRoles.innerHTML = "";
        // Agregar nueva lista de roles
        data.forEach(rol => {
          const option = document.createElement("option");
          option.value = rol.id;
          option.textContent = rol.nombre;
          selectRoles.appendChild(option);
        });
      })
      .catch(error => {
        console.error("Error al cargar roles:", error);
        selectRoles.innerHTML = `<option value="">Error al cargar</option>`;
      });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
      localStorage.removeItem("usuario"); // Elimina la sesión
      window.location.href = "login.html"; // Redirige
    });
  }

  // Protege la vista
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario || usuario.rol !== 'Admin') {
    window.location.href = "login.html"; // Solo Admin puede acceder
  }
});

// Filtrar usuarios dinámicamente según texto, rol o departamento
function mostrarUsuariosFiltrados() {
  const texto = document.getElementById('busquedaUsuario')?.value.toLowerCase() || '';
  const rolSeleccionado = document.getElementById('filtroRol')?.value || '';
  const departamentoSeleccionado = document.getElementById('filtroDepartamento')?.value || '';

  const filtrados = usuariosCargados.filter(usuario => {
    const coincideTexto = (
      usuario.nombre.toLowerCase().includes(texto) ||
      usuario.apellidos.toLowerCase().includes(texto) ||
      usuario.correo.toLowerCase().includes(texto)
    );

    const coincideRol = rolSeleccionado === "" || usuario.rol?.nombre === rolSeleccionado;

    const coincideDepartamento =
      departamentoSeleccionado === "" ||
      usuario.departamentos.some(dep => dep.nombre === departamentoSeleccionado);

    return coincideTexto && coincideRol && coincideDepartamento;
  });

  mostrarUsuarios(filtrados);
}

// Llenar los filtros con valores únicos de los datos
function cargarFiltrosDinamicos() {
  const filtroRol = document.getElementById('filtroRol');
  const filtroDepartamento = document.getElementById('filtroDepartamento');

  if (!filtroRol || !filtroDepartamento) return;

  // Limpiar opciones anteriores
  filtroRol.innerHTML = `<option value="">Todos los roles</option>`;
  filtroDepartamento.innerHTML = `<option value="">Todos los departamentos</option>`;

  const roles = [...new Set(usuariosCargados.map(u => u.rol?.nombre).filter(Boolean))];
  const departamentos = [...new Set(usuariosCargados.flatMap(u => u.departamentos.map(dep => dep.nombre)))];

  roles.forEach(rol => {
    const option = document.createElement('option');
    option.value = rol;
    option.textContent = rol;
    filtroRol.appendChild(option);
  });

  departamentos.forEach(dep => {
    const option = document.createElement('option');
    option.value = dep;
    option.textContent = dep;
    filtroDepartamento.appendChild(option);
  });
}

// Eventos al cambiar filtros o escribir búsqueda
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('busquedaUsuario')?.addEventListener('input', mostrarUsuariosFiltrados);
  document.getElementById('filtroRol')?.addEventListener('change', mostrarUsuariosFiltrados);
  document.getElementById('filtroDepartamento')?.addEventListener('change', mostrarUsuariosFiltrados);
});

document.addEventListener('DOMContentLoaded', () => {
  const btnLimpiar = document.getElementById('btnLimpiarFiltros');

  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', () => {
      document.getElementById('busquedaUsuario').value = '';
      document.getElementById('filtroRol').value = '';
      document.getElementById('filtroDepartamento').value = '';
      mostrarUsuariosFiltrados(); // ← vuelve a mostrar todo
    });
  }
});

function mostrarToast(mensaje, duracion = 2500) {
  const toast = document.getElementById('toast');
  toast.textContent = mensaje;
  toast.classList.add('show');
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 400); // Oculta después de transición
  }, duracion);
}
