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
document.addEventListener('DOMContentLoaded', obtenerDepartamentos);

// Evento de envío del formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = form.nombre.value.trim();
  const area = form.area.value.trim();
  const descripcion = form.descripcion.value.trim();
  const encargados = Array.from(form.encargados.selectedOptions).map(
    (opt) => opt.value
  );
  const idDepartamento = form.departamento.value;
  console.log('idDepartamento', idDepartamento);

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
