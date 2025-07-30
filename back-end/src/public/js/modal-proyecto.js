// modal-proyecto.js

// ======================== TOGGLE DE OBJETIVOS ========================
const toggleObjetivos = document.getElementById("toggleObjetivos");
const seccionObjetivos = document.getElementById("seccionObjetivos");
const agregarObjetivoBtn = document.getElementById("agregarObjetivo");
const objetivosContainer = document.getElementById("objetivosContainer");
const modalTitulo = document.querySelector("#addProjectModal h2");
const submitBtn = document.querySelector("#projectForm button[type='submit']");
const filtroDepartamento = document.getElementById("filtro-departamento");

if (toggleObjetivos) {
  toggleObjetivos.addEventListener("change", function () {
    seccionObjetivos.classList.toggle("hidden", !this.checked);
  });
}

// ======================== AGREGAR NUEVO OBJETIVO ========================
function crearCampoObjetivo(valor = '') {
  const contenedor = document.createElement("div");
  contenedor.classList.add("objetivo-row");

  const input = document.createElement("input");
  input.type = "text";
  input.classList.add("objetivo-input");
  input.placeholder = "Escribe un objetivo";
  input.required = true;
  input.value = valor;

  const btnEliminar = document.createElement("button");
  btnEliminar.type = "button";
  btnEliminar.textContent = "❌";
  btnEliminar.classList.add("btn-eliminar-objetivo");
  btnEliminar.title = "Eliminar objetivo";
  btnEliminar.addEventListener("click", () => contenedor.remove());

  contenedor.appendChild(input);
  contenedor.appendChild(btnEliminar);

  return contenedor;
}

agregarObjetivoBtn?.addEventListener("click", () => {
  objetivosContainer.appendChild(crearCampoObjetivo());
});


// ======================== MODAL DE ENCARGADOS ========================
const modalEncargados = document.getElementById("modalEncargados");
const abrirModalEncargadosBtn = document.getElementById("abrirModalEncargados");
const encargadosSeleccionados = document.getElementById("encargadosSeleccionados");
const listaEncargados = document.getElementById("listaEncargados");

abrirModalEncargadosBtn?.addEventListener("click", async function () {
  const departamentoSeleccionadoId = document.getElementById("filtro-departamento").value;
  await cargarEncargadosPorDepartamento(departamentoSeleccionadoId);
  modalEncargados.classList.remove("hidden");
});

function cerrarModalEncargados() {
  modalEncargados.classList.add("hidden");
}

function guardarEncargados() {
  const checkboxes = listaEncargados.querySelectorAll("input[type='checkbox']:checked");
  encargadosSeleccionados.innerHTML = "";

  checkboxes.forEach(cb => {
    const id = cb.value;
    const label = document.querySelector(`label[for="encargado-${id}"]`);
    const nombre = label ? label.innerText : "Sin nombre";

    const span = document.createElement("span");
    span.textContent = nombre;
    span.dataset.id = id; // 👈 importante para enviar al backend luego
    span.classList.add("etiqueta-encargado");

    encargadosSeleccionados.appendChild(span);
  });

  cerrarModalEncargados();
}



// ======================== FILTRADO DE ENCARGADOS ========================
filtroDepartamento?.addEventListener("change", function () {
  const selected = this.value;
  const filas = listaEncargados.querySelectorAll(".fila-encargado");
  filas.forEach(fila => {
    const departamento = fila.dataset.departamento;
    fila.style.display = selected === "todos" || departamento === selected ? "block" : "none";
  });
});

// ======================== ENCARGADOS DE EJEMPLO ========================
async function cargarEncargadosPorDepartamento(idDepartamento) {
  try {
    const idDep = document.getElementById("filtro-departamento").value;
    const response = await fetch(`http://localhost:3000/api/departamentos/usuario/${idDep}`);
    const usuarios = await response.json();

    const contenedor = document.getElementById('lista-encargados');
    contenedor.innerHTML = ''; // limpia los anteriores

    usuarios.forEach(usuario => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = usuario.id;
      checkbox.id = `encargado-${usuario.id}`;
      checkbox.classList.add('checkbox-encargado');

      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.innerText = `${usuario.nombre} ${usuario.apellidos}`;

      const div = document.createElement('div');
      div.classList.add('encargado-item');
      div.appendChild(checkbox);
      div.appendChild(label);

      contenedor.appendChild(div);
    });

  } catch (error) {
    console.error('Error al cargar encargados:', error);
  }
}


// ======================== UTILIDAD GLOBAL ========================
function closeAddModal() {
  document.getElementById("addProjectModal").classList.add("hidden");
  document.getElementById("projectForm").reset();
  objetivosContainer.innerHTML = '';
  objetivosContainer.appendChild(crearCampoObjetivo());
  encargadosSeleccionados.innerHTML = "";
  seccionObjetivos.classList.add("hidden");
  toggleObjetivos.checked = false;
  delete document.getElementById("projectForm").dataset.editingId;
  modalTitulo.textContent = "Crear Nuevo Proyecto";
  submitBtn.textContent = "Crear Proyecto";
}

// ======================== SOPORTE PARA EDICIÓN ========================
window.loadProyectoParaEdicion = function (proyecto) {
  document.getElementById("addProjectModal").classList.remove("hidden");
  modalTitulo.textContent = "Editar Proyecto";
  submitBtn.textContent = "Guardar Cambios";
  document.getElementById("nombre").value = proyecto.nombre;
  document.getElementById("area").value = proyecto.area;
  document.getElementById("descripcion").value = proyecto.descripcion;

  toggleObjetivos.checked = proyecto.tieneObjetivos;
  seccionObjetivos.classList.toggle("hidden", !proyecto.tieneObjetivos);

  objetivosContainer.innerHTML = "";
  if (proyecto.tieneObjetivos) {
    proyecto.objetivos.forEach(obj => {
      objetivosContainer.appendChild(crearCampoObjetivo(obj.texto));
    });
  }


  encargadosSeleccionados.innerHTML = "";
  proyecto.encargados.forEach(nombre => {
    const span = document.createElement("span");
    span.textContent = nombre;
    span.classList.add("etiqueta-encargado");
    encargadosSeleccionados.appendChild(span);
  });

  document.getElementById("projectForm").dataset.editingId = proyecto.id;
};

// ======================== BOTÓN EDITAR DESDE LA TARJETA ========================
window.editarProyecto = function (id) {
  const proyecto = window.proyectos?.find(p => p.id === id);
  if (proyecto) {
    window.loadProyectoParaEdicion(proyecto);
  }
};