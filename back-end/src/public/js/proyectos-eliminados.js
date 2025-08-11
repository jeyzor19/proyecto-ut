// === Llenar sidebar con departamentos del usuario ===

async function llenarSidebarDepartamentos() {
  const lista = document.getElementById('lista-departamentos');
  const usuario = JSON.parse(localStorage.getItem('usuario'));


  // Agregar botón "Todos"
  const btnTodos = document.createElement('button');
  btnTodos.classList.add('dep-btn', 'selected');
  btnTodos.textContent = 'Todos';
  btnTodos.addEventListener('click', () => {
    document.querySelectorAll('.dep-btn').forEach(b => b.classList.remove('selected'));
    btnTodos.classList.add('selected');
    filtrarProyectosEliminadosPorDepartamento(); // todos
  });
  lista.appendChild(btnTodos);

  try {
    const res = await fetch(`/api/departamentos/usuario/${usuario.id}`);
    const departamentos = await res.json();

    departamentos.forEach(dep => {
      const btn = document.createElement('button');
      btn.classList.add('dep-btn');
      btn.textContent = dep.nombre;
      btn.dataset.id = dep.id;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.dep-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        filtrarProyectosEliminadosPorDepartamento(dep.id);
      });

      lista.appendChild(btn);
    });
  } catch (error) {
    console.error('Error al cargar departamentos:', error);
  }
}

// === Cargar todos los proyectos eliminados al inicio ===
async function filtrarProyectosEliminadosPorDepartamento(idDepartamento = null) {
  const container = document.getElementById('proyectosEliminadosContainer');
  container.innerHTML = '';

  try {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const response = await fetch(`/api/proyectos/eliminados/usuario/${usuario.id}`);
    const proyectos = await response.json();

    const filtrados = idDepartamento
      ? proyectos.filter(p => p.id_departamento == idDepartamento)
      : proyectos;

    if (filtrados.length === 0) {
      container.innerHTML = '<p>No hay proyectos eliminados para este departamento.</p>';
      return;
    }

    renderizarProyectosEliminados(filtrados);
  } catch (err) {
    console.error('Error al filtrar proyectos eliminados:', err);
    container.innerHTML = '<p>Error al cargar los proyectos eliminados.</p>';
  }
}

// === Renderizar tarjetas de proyectos eliminados ===
function renderizarProyectosEliminados(proyectos) {
  const container = document.getElementById('proyectosEliminadosContainer');
  container.innerHTML = '';

  proyectos.forEach(proyecto => {
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta-proyecto');

    tarjeta.innerHTML = `
      <div class="contenido-proyecto">
        <h3>${proyecto.nombre}</h3>
        <p><strong>Área:</strong> ${proyecto.area}</p>
        <p><strong>Descripción:</strong> ${proyecto.descripcion}</p>
        <p><strong>Fecha:</strong> ${new Date(proyecto.fecha_creacion).toLocaleDateString('es-MX')}</p>
      </div>
      <div class="acciones-proyecto">
        <button class="btn-reactivar" data-id="${proyecto.id}">Reactivar</button>
      </div>
    `;

    container.appendChild(tarjeta);
  });

  document.querySelectorAll('.btn-reactivar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const confirmar = confirm('¿Deseas reactivar este proyecto?');
      if (!confirmar) return;

      try {
        const res = await fetch(`/api/proyectos/reactivar/${id}`, { method: 'PUT' });
        const data = await res.json();

        if (!res.ok) throw new Error(data.mensaje);

        alert('✅ Proyecto reactivado con éxito');
        const selectedBtn = document.querySelector('.dep-btn.selected');
        const selectedId = selectedBtn ? selectedBtn.dataset.id : null;
        filtrarProyectosEliminadosPorDepartamento(selectedId);
      } catch (err) {
        console.error(err);
        alert('❌ No se pudo reactivar el proyecto');
      }
    });
  });
}

// === Inicialización ===
document.addEventListener('DOMContentLoaded', async () => {
  await llenarSidebarDepartamentos();
  await filtrarProyectosEliminadosPorDepartamento();
  // Cargar todos al inicio

  // Toggle de la barra lateral
  const toggleBtn = document.getElementById('toggleSidebar');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar');
      const contenedor = document.querySelector('.contenido'); // o .contenedor-principal si tienes ese nombre
      sidebar.classList.toggle('oculta');
      contenedor.classList.toggle('expandido');
    });
  }

  document.getElementById('btn-volver').addEventListener('click', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario || !usuario.rol) {
    alert('No se pudo determinar el rol del usuario.');
    return;
  }

  switch (usuario.rol.toLowerCase()) {
    case 'admin':
      window.location.href = 'admin.html';
      break;
    case 'deplider':
      window.location.href = 'deplider.html';
      break;
    case 'usuario':
      window.location.href = 'usuario.html';
      break;
    default:
      alert('Rol de usuario no reconocido.');
  }
});


});

