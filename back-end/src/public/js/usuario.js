// usuario.js

const usuario = JSON.parse(localStorage.getItem('usuario'));
if (!usuario || usuario.rol !== 'Usuario') {
  window.location.href = 'login.html';
}

const logoutBtn = document.getElementById('logoutBtn');
const listaDepartamentos = document.getElementById('listaDepartamentos');
const contenedorProyectos = document.getElementById('contenedorProyectos');
const btnNuevoProyecto = document.getElementById('btnNuevoProyecto');
const btnCambiarVista = document.getElementById('btnCambiarVista');

let vistaCompacta = true;

document.getElementById("toggleSidebar").addEventListener("click", () => {
  const sidebar = document.querySelector(".sidebar");
  const contenedor = document.querySelector(".contenedor-principal");
  sidebar.classList.toggle("oculta");
  contenedor.classList.toggle("expandido");
});

btnNuevoProyecto.addEventListener('click', () => {
  window.location.href = 'crear-proyecto.html';
});

// ================== Ver proyectos eliminados ==================
document.getElementById('btnVerEliminados').addEventListener('click', () => {
  window.location.href = 'proyectos-eliminados.html';
});

document.addEventListener("DOMContentLoaded", () => {
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.href = "login.html";
    });
  }

  if (!usuario) {
    window.location.href = "login.html";
  }
});

// ================== Cargar departamentos asignados ==================
async function cargarDepartamentos() {
  try {
    const res = await fetch('http://localhost:3000/api/departamentos');
    const departamentos = await res.json();
    listaDepartamentos.innerHTML = '';

    const depAsignados = usuario.departamentos || [];

    departamentos
      .filter(dep => depAsignados.includes(dep.id))
      .forEach(dep => {
        const boton = document.createElement('button');
        boton.textContent = dep.nombre;
        boton.classList.add('btn-departamento');
        boton.dataset.id = dep.id;
        boton.addEventListener('click', () => cargarProyectosPorDepartamento(dep.id));
        listaDepartamentos.appendChild(boton);
      });
  } catch (error) {
    console.error('Error al cargar departamentos:', error);
  }
}

// ================== Cargar proyectos visibles al usuario ==================
async function cargarProyectosPorDepartamento(idDepartamento) {
  try {
    contenedorProyectos.innerHTML = '';
    console.log(`Mostrar proyectos creados por el usuario ${usuario.nombre} o donde es encargado, en el departamento ${idDepartamento}`);
    // Esta lógica se implementará en el backend
  } catch (error) {
    console.error('Error al cargar proyectos:', error);
  }
}

btnCambiarVista.addEventListener('click', () => {
  vistaCompacta = !vistaCompacta;
  contenedorProyectos.classList.toggle('vista-compacta', vistaCompacta);
  contenedorProyectos.classList.toggle('vista-detallada', !vistaCompacta);
});

// ================== Inicializar ==================
cargarDepartamentos();
