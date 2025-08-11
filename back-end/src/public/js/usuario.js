// usuario.js

import {llenarSidebarDepartamentos} from './obtnrproyectos.js';

const usuario = JSON.parse(localStorage.getItem('usuario'));
if (!usuario || usuario.rol !== 'Usuario') {
  window.location.href = 'login.html';
}

// ================== Elementos del DOM ==================
const logoutBtn = document.getElementById('logoutBtn');
const listaDepartamentos = document.getElementById('listaDepartamentos');
const contenedorProyectos = document.getElementById('proyectosContainer');
const btnNuevoProyecto = document.getElementById('btnNuevoProyecto');
const btnVista = document.getElementById('btnVista');

let vistaCompacta = true;

document.getElementById("toggleSidebar").addEventListener("click", () => {
  const sidebar = document.querySelector(".sidebar");
  const contenedor = document.querySelector(".contenedor-principal");
  sidebar.classList.toggle("oculta");
  contenedor.classList.toggle("expandido");
});

document.getElementById('btnNuevoProyecto').addEventListener('click', () => {
  window.location.href = 'crear-proyecto.html';
});

// ================== Ver proyectos eliminados ==================
document.getElementById('btnVerEliminados').addEventListener('click', () => {
  window.location.href = 'proyectos-eliminados.html';
});

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('usuario');
      window.location.href = 'login.html';
    });
  }

  // Solo validamos si hay sesión (sin validar rol)
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario) {
    window.location.href = 'login.html';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  llenarSidebarDepartamentos();
});



// ================== Cargar proyectos ==================
/*async function cargarProyectosPorRolDeUsuario() {
  mostrarProyectos(usuario.id)
}*/

async function cargarProyectosPorDepartamento(idDepartamento) {
  try {
    contenedorProyectos.innerHTML = '';
    // Aquí se hará el fetch real al backend más adelante
    console.log(`Cargar proyectos del departamento ${idDepartamento}`);
  } catch (error) {
    console.error('Error al cargar proyectos:', error);
  }
}


btnVista.addEventListener('click', () => {
  vistaCompacta = !vistaCompacta;
  contenedorProyectos.classList.toggle('vista-compacta', vistaCompacta);
  contenedorProyectos.classList.toggle('vista-detallada', !vistaCompacta);
});

// ================== Inicializar ==================

cargarProyectosPorRolDeUsuario();
