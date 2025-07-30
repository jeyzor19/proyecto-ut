// proyectos-eliminados.js

document.addEventListener('DOMContentLoaded', () => {
  const listaDepartamentos = document.getElementById('lista-departamentos');
  const proyectosEliminadosContainer = document.getElementById('proyectosEliminadosContainer');


  const toggleBtn = document.getElementById('toggle-sidebar');
  const sidebar = document.querySelector('.sidebar');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
  });


  // Simular carga de departamentos (se reemplazará con fetch más adelante)
  /*const departamentos = [
    { id: 1, nombre: 'Sistemas' },
    { id: 2, nombre: 'Administración' },
    { id: 3, nombre: 'Contabilidad' },
  ];*/

  departamentos.forEach(dep => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = dep.nombre;
    btn.addEventListener('click', () => cargarProyectosEliminados(dep.id));
    li.appendChild(btn);
    listaDepartamentos.appendChild(li);
  });

  function cargarProyectosEliminados(departamentoId) {
    // Simular proyectos eliminados (más adelante se usará fetch)
    /*const proyectos = [
      {
        id: 101,
        nombre: 'Proyecto X',
        area: 'Sistemas',
        descripcion: 'Reactivación de servidor.',
        estado: 'Cancelado',
        departamentoId: 1,
      },
      {
        id: 102,
        nombre: 'Revisión Presupuesto',
        area: 'Administración',
        descripcion: 'Análisis de costos anuales.',
        estado: 'Cancelado',
        departamentoId: 2,
      },
    ];*/

    proyectosEliminadosContainer.innerHTML = '';

    const filtrados = proyectos.filter(p => p.departamentoId === departamentoId);

    if (filtrados.length === 0) {
      proyectosEliminadosContainer.innerHTML = '<p>No hay proyectos eliminados en este departamento.</p>';
      return;
    }

    filtrados.forEach(proy => {
      const card = document.createElement('div');
      card.classList.add('proyecto-card');

      const nombre = document.createElement('h3');
      nombre.textContent = proy.nombre;
      const descripcion = document.createElement('p');
      descripcion.textContent = proy.descripcion;
      const estado = document.createElement('p');
      estado.textContent = `Estado: ${proy.estado}`;
      estado.classList.add('estado');

      const btnRestaurar = document.createElement('button');
      btnRestaurar.textContent = 'Restaurar';
      btnRestaurar.addEventListener('click', () => {
        alert(`Proyecto restaurado: ${proy.nombre}`);
        // Aquí irá la lógica real con fetch
      });

      card.append(nombre, descripcion, estado, btnRestaurar);
      proyectosEliminadosContainer.appendChild(card);
    });
  }

  // Cargar por defecto el primer departamento
  if (departamentos.length > 0) cargarProyectosEliminados(departamentos[0].id);
});
