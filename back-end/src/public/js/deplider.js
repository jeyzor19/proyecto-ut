// deplider.js
import {llenarSidebarDepartamentos } from './obtnrproyectos.js';


// ================== Validar sesión ==================
const usuario = JSON.parse(localStorage.getItem('usuario'));
if (!usuario || usuario.rol !== 'DepLider') {
  window.location.href = 'login.html';
}

// ================== Elementos del DOM ==================
const logoutBtn = document.getElementById('logoutBtn');
const listaDepartamentos = document.getElementById('listaDepartamentos');
const contenedorProyectos = document.getElementById('proyectosContainer');
const btnNuevoProyecto = document.getElementById('btnNuevoProyecto');
const btnCambiarVista = document.getElementById('btnCambiarVista');
const btnVerEliminados = document.getElementById('btnVerEliminados');

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


// ================== Cargar proyectos ==================
async function cargarProyectosPorRolDeUsuario() {
  mostrarProyectos(usuario.id)
}

document.addEventListener('DOMContentLoaded', () => {
  llenarSidebarDepartamentos();
});

async function cargarProyectosPorDepartamento(idDepartamento) {
  try {
    contenedorProyectos.innerHTML = '';
    // Aquí se hará el fetch real al backend más adelante
    console.log(`Cargar proyectos del departamento ${idDepartamento}`);
  } catch (error) {
    console.error('Error al cargar proyectos:', error);
  }
}


// ================== Cambiar vista ==================
btnCambiarVista.addEventListener('click', () => {
  vistaCompacta = !vistaCompacta;
  contenedorProyectos.classList.toggle('vista-compacta', vistaCompacta);
  contenedorProyectos.classList.toggle('vista-detallada', !vistaCompacta);
});

// ================== Ver proyectos eliminados ==================
btnVerEliminados.addEventListener('click', () => {
  window.location.href = 'proyectos-eliminados.html';
});

// ================== Inicializar ==================
cargarDepartamentos();
cargarProyectosPorRolDeUsuario();
