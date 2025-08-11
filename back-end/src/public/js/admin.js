// admin.js

import {llenarSidebarDepartamentos } from './obtnrproyectos.js';

const usuario = JSON.parse(localStorage.getItem('usuario'));
if (!usuario || usuario.rol !== 'Admin') {
  window.location.href = 'login.html';
}

// ================== Elementos del DOM ==================
const logoutBtn = document.getElementById('logoutBtn');
const listaDepartamentos = document.getElementById('listaDepartamentos');
const contenedorProyectos = document.getElementById('contenedorProyectos');
const btnNuevoProyecto = document.getElementById('btnNuevoProyecto');
const btnVista = document.getElementById('btnVista');
const btnVerEliminados = document.getElementById('btnVerEliminados');

let vistaCompacta = true;

document.getElementById('toggleSidebar').addEventListener('click', () => {
  const sidebar = document.querySelector('.sidebar');
  const contenedor = document.querySelector('.contenedor-principal');
  sidebar.classList.toggle('oculta');
  contenedor.classList.toggle('expandido');
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
async function cargarProyectosPorRolDeUsuario() {
  mostrarProyectos(usuario.id)
}

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
btnVista.addEventListener('click', () => {
  vistaCompacta = !vistaCompacta;
  contenedorProyectos.classList.toggle('vista-compacta', vistaCompacta);
  contenedorProyectos.classList.toggle('vista-detallada', !vistaCompacta);
});

// ================== Nuevo proyecto ==================

// ================== Inicializar ==================
cargarDepartamentos();
cargarProyectosPorRolDeUsuario();


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-volver').addEventListener('click', () => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));

        if (!usuario || !usuario.rol) {
            alert('No se pudo determinar el rol del usuario.');
            return;
        }

        switch (usuario.rol.toLowerCase()) {
            case 'admin':
                window.location.href = 'dashboardusuarios.html';
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