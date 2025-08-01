// js/crear-proyecto.js

// Obtener elementos
const form = document.getElementById('formCreatePrj');
const objetivosContainer = document.getElementById('objetivosContainer');
const agregarObjetivoBtn = document.getElementById('agregarObjetivo');
const cancelarProyecto = document.getElementById('cancelarProyecto');

// Agregar un nuevo objetivo
agregarObjetivoBtn.addEventListener('click', () => {
  const div = document.createElement('div');
  div.classList.add('objetivo-item');
  div.innerHTML = `
    <input type="text" name="objetivos[]" placeholder="Objetivo" required>
    <button type="button" class="eliminarObjetivo">✖</button>
  `;
  objetivosContainer.appendChild(div);

  // Evento para eliminar objetivo
  div.querySelector('.eliminarObjetivo').addEventListener('click', () => {
    div.remove();
  });
});

// Evento Cancelar

//localStorage.setItem('usuario', JSON.stringify(data));
const data = localStorage.getItem('usuario');
const user = JSON.parse(data);
console.log('user', user);

/***************
 * Obtener Departamentos
 */
async function obtenerDepartamentos() {
  try {
    const response = await fetch('http://localhost:3000/api/departamentos');
    if (!response.ok) {
      console.log('error cargando departamentos');
      return;
    }

    const departamentos = await response.json();
    // console.log('departamentos', departamentos);
    /* [{ "id": 9, "nombre": "Administración" }] */
    const selectElement = document.getElementById('departamento');
    selectElement.innerHTML = `
      <option value="">Selecciona un departamento</option>
      ${departamentos
        .map((d) => `<option value="${d.id}">${d.nombre}</option>`)
        .join('')}
    `;
  } catch (error) {
    console.log('Error obteniendo los departamentos', error);
  }
}

async function obtenerEncargadosPorDepartamento(idDepartamento) {
  try {
    const containerEncargados = document.getElementById('encargados');

    if (!idDepartamento) {
      containerEncargados.innerHTML =
        '<div class="empty-state">Selecciona un departamento para ver los encargados</div>';
      return;
    }

    try {
      containerEncargados.innerHTML =
        '<div class="loading-encargados">Cargando encargados...</div>';

      await new Promise((resolve) => setTimeout(resolve, 800));

      const response = await fetch(
        `http://localhost:3000/api/usuarios/departamentos/${idDepartamento}`
      );
      if (!response.ok) {
        console.log('error cargando encargados');
        return;
      }
      const data = await response.json();
      console.log('data', data);

      if (data.encargados.length === 0) {
        containerEncargados.innerHTML =
          '<div class="empty-state">No hay encargados disponibles para este departamento</div>';
        return;
      }

      // Create checkboxes for each encargado
      containerEncargados.innerHTML = data.encargados
        .map(
          (encargado) => `
            <div class="encargados-item">
              <input type="checkbox" 
                id="encargado_${encargado.id}" 
                name="encargados" 
                value="${encargado.id}">
              <label for="encargado_${encargado.id}">${encargado.nombre}</label>
            </div>
          `
        )
        .join('');
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  obtenerDepartamentos();

  const departamentoSelect = document.getElementById('departamento');
  departamentoSelect.addEventListener('change', function () {
    const selectedDepartamento = this.value;
    console.log('selectedDepartamento', selectedDepartamento);
    obtenerEncargadosPorDepartamento(selectedDepartamento);
  });
});

// Evento de envío del formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = form.nombre.value.trim();
  const area = form.area.value.trim();
  const descripcion = form.descripcion.value.trim();
  const idDepartamento = form.departamento.value;
  const encargados = Array.from(
    form.querySelectorAll('input[name="encargados"]:checked')
  ).map((checkbox) => checkbox.value);

  console.log('encargados', encargados);

  const objetivos = Array.from(
    form.querySelectorAll('input[name="objetivos[]"]')
  )
    .map((input) => input.value.trim())
    .filter((txt) => txt.length > 0);

  const proyecto = {
    nombre,
    area,
    descripcion,
    encargados,
    objetivos,
    idDepartamento,
  };

  console.log('Proyecto a guardar:', proyecto);

  // await fetch('http://localhost:3000/api/proyectos', {...})
  try {
    const response = await fetch('http://localhost:3000/api/proyectos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuario: user,
        proyecto: proyecto,
      }),
    });

    if (!response.ok) throw new Error('Response not ok');

    alert('Proyecto creado correctamente');
    window.location.href = 'admin.html';
  } catch (error) {
    alert(`Error: ${error}`);
  }
});

/************
 **********
 Cancelar proyecto 
 */
cancelarProyecto.addEventListener('click', () => {
  if (user.rol === 'Admin') {
    window.location.href = 'admin.html';
  } else if (user.rol === 'DepLider') {
    window.location.href = 'deplider.html';
  } else {
    window.location.href = 'usuario.html';
  }
});
