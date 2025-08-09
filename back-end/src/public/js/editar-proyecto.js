// js/crear-proyecto.js

// Obtener elementos
const form = document.getElementById('formCreatePrj');
const objetivosContainer = document.getElementById('objetivosContainer');
const agregarObjetivoBtn = document.getElementById('agregarObjetivo');
const cancelarProyecto = document.getElementById('cancelarProyecto');

// Evento Cancelar

//localStorage.setItem('usuario', JSON.stringify(data));
const data = localStorage.getItem('usuario');
const user = JSON.parse(data);

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
        return;
      }
      const data = await response.json();

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

const objetivosInfo = []; // {id, text: objetivo}
let objetivoCounter = 0; // usado para manejar los indices de objetivosInfo
function crearObjetivos() {
  const botonAgregar = document.getElementById('agregarObjetivo');
  const listaObjetivos = document.getElementById('listaObjetivos');
  const nuevoObjetivo = document.getElementById('objetivo-nuevo');
  let textareaOpened = false;

  // Mostrar text area
  botonAgregar.addEventListener('click', function () {
    textareaOpened = true;

    if (textareaOpened) {
      // crear text area
      const textarea = document.createElement('textarea');
      textarea.className = 'objetivo-input';
      textarea.placeholder = 'Escribe tu objetivo aquí...';
      textarea.id = `objetivo-${textareaOpened}`;

      // crear botones de acción
      const divAcciones = document.createElement('div');
      divAcciones.className = 'objetivo-actions';

      const botonGuardar = document.createElement('button');
      botonGuardar.textContent = 'Guardar';
      botonGuardar.className = 'guardar-btn';
      botonGuardar.type = 'button';

      // CANCELAR
      const botonCancelar = document.createElement('button');
      botonCancelar.type = 'button';
      botonCancelar.textContent = 'Cancelar';
      botonCancelar.className = 'cancelar-btn';
      botonCancelar.addEventListener('click', () => {
        nuevoObjetivo.replaceChildren();
        textareaOpened = false;
      });
      // Agregar elementos al div de acciones
      divAcciones.appendChild(botonGuardar);
      divAcciones.appendChild(botonCancelar);

      // Agregar textarea y botones a div
      nuevoObjetivo.appendChild(textarea);
      nuevoObjetivo.appendChild(divAcciones);
      // Enfocar el textarea
      textarea.focus();

      // GUARDAR
      // Crear elemento LI con boton para elimnar objetivo
      botonGuardar.addEventListener('click', () => {
        const textoObjetivo = textarea.value.trim();

        if (!textoObjetivo.length) {
          alert('Agrega un objetivo antes de guardar.');
          return;
        }
        const objetivoId = objetivoCounter++;
        objetivosInfo.push({ id: objetivoId, texto: textoObjetivo });

        // crear li para agregar a la lista
        const objetivoLi = document.createElement('li');
        objetivoLi.textContent = textoObjetivo;

        // agreagr botón de eliminar objetivo
        const eliminarObjBoton = document.createElement('button');
        eliminarObjBoton.type = 'button';
        eliminarObjBoton.className = 'eliminar-obj-btn';
        eliminarObjBoton.textContent = '❌';

        eliminarObjBoton.addEventListener('click', () => {
          const objetivoEnLiIndex = objetivosInfo.findIndex(
            (obj) => obj.id === objetivoId
          );

          if (objetivoEnLiIndex > -1) {
            objetivosInfo.splice(objetivoEnLiIndex, 1);
            objetivoLi.remove();
          }
        });

        objetivoLi.appendChild(eliminarObjBoton);
        listaObjetivos.appendChild(objetivoLi);

        // Limpiar textarea y cerrar textarea
        textarea.value = '';
        nuevoObjetivo.replaceChildren();
        textareaOpened = false;
      });
    }
  });
}

async function getFormData(usuarioId, proyectoId) {
  console.log('edit');
  console.log('usuarioId', usuarioId);
  console.log('proyectoId', proyectoId);
  try {
    const response = await fetch(
      `http://localhost:3000/api/proyectos/porid/${usuarioId}/${proyectoId}`
    );

    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Load data and populate

  obtenerDepartamentos();

  const departamentoSelect = document.getElementById('departamento');
  departamentoSelect.addEventListener('change', function () {
    const selectedDepartamento = this.value;
    obtenerEncargadosPorDepartamento(selectedDepartamento);
  });

  // Objetivos
  crearObjetivos();

  // Obtener Datos de proyecto
  const urlParams = new URLSearchParams(window.location.search);
  const usuarioId = urlParams.get('usuarioId');
  const proyectoId = urlParams.get('proyectoId');
  getFormData(usuarioId, proyectoId);
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

  const objetivos = objetivosInfo
    .map((obj) => obj.texto.trim())
    .filter((txt) => txt.length > 0);

  const proyecto = {
    nombre,
    area,
    descripcion,
    encargados,
    objetivos,
    idDepartamento,
  };

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
