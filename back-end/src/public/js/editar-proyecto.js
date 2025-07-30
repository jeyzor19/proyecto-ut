// editar-proyecto.js

// Esperamos que el proyecto a editar esté en localStorage temporalmente
const proyecto = JSON.parse(localStorage.getItem('proyectoEditar'));
const usuario = JSON.parse(localStorage.getItem('usuario'));

/*if (!proyecto || !usuario) {
  alert('No se ha cargado correctamente el proyecto.');
  window.location.href = 'admin.html';
}*/

// Rellenar campos con los datos del proyecto
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('nombre').value = proyecto.nombre || '';
  document.getElementById('area').value = proyecto.area || '';
  document.getElementById('descripcion').value = proyecto.descripcion || '';

  const encargadosInput = document.getElementById('encargados');
  encargadosInput.value = proyecto.encargados?.join(', ') || '';

  const objetivosContainer = document.getElementById('objetivosContainer');
  proyecto.objetivos?.forEach((obj, idx) => {
    const div = document.createElement('div');
    div.className = 'objetivo-item';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = obj.texto;
    input.dataset.index = idx;

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.onclick = () => div.remove();

    div.appendChild(input);
    div.appendChild(btnEliminar);
    objetivosContainer.appendChild(div);
  });
});

// Agregar nuevo objetivo
function agregarObjetivo() {
  const objetivosContainer = document.getElementById('objetivosContainer');
  const div = document.createElement('div');
  div.className = 'objetivo-item';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nuevo objetivo';

  const btnEliminar = document.createElement('button');
  btnEliminar.textContent = 'Eliminar';
  btnEliminar.onclick = () => div.remove();

  div.appendChild(input);
  div.appendChild(btnEliminar);
  objetivosContainer.appendChild(div);
}

document.getElementById('btnAgregarObjetivo').addEventListener('click', agregarObjetivo);

document.getElementById('btnGuardar').addEventListener('click', () => {
  const nombre = document.getElementById('nombre').value.trim();
  const area = document.getElementById('area').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const encargados = document.getElementById('encargados').value.split(',').map(e => e.trim()).filter(Boolean);

  const objetivosInputs = document.querySelectorAll('#objetivosContainer input');
  const objetivos = Array.from(objetivosInputs).map(input => ({ texto: input.value.trim(), cumplido: false })).filter(obj => obj.texto);

  const proyectoActualizado = {
    ...proyecto,
    nombre,
    area,
    descripcion,
    encargados,
    objetivos
  };

  // Aquí va el fetch al backend para actualizar
  console.log('Proyecto a actualizar:', proyectoActualizado);
  alert('Proyecto actualizado (simulado).');
  window.location.href = 'admin.html';
});

document.getElementById('btnCancelar').addEventListener('click', () => {
  window.location.href = 'admin.html';
});
