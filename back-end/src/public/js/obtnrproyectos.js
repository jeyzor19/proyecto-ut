

export default async function mostrarProyectos(idUsuario) {
    try {
    const response = await fetch(
        `http://localhost:3000/api/proyectos/usuario/${idUsuario}`
        );
        if (!response.ok) {
        console.log('error cargando departamentos');
        return;
        }

        const proyectos = await response.json();
        console.log('proyectos', proyectos);

        // Crear elementos html - Tarjeta - Card
    
        const proyectosContainer = document.getElementById('proyectosContainer')
        proyectosContainer.innerHTML = ''; // Limpiar anteriores

        proyectos.forEach(proyecto => {
            const {
            nombre,
            descripcion,
            area,
            progreso,
            fecha_creacion,
            visible,
             //creador
            //encargados, //usuarios
            //objetivos // array de objetivos
            } = proyecto;
            /* 
            {
            "id": 1,
            "nombre": "Proyecto 1",
            "descripcion": "asdasdasdadads",
            "progreso": 0,
            "fecha_creacion": "2025-07-31T06:17:50.000Z",
            "visible": true,
            "area": "Area ejemplo",
            "id_departamento": 1,
            "id_creador": 1
            }
            */
            // Lista de encargados
            //const listaEncargados = encargados.map(enc => `${enc.nombre} ${enc.apellidos}`).join(', ') || 'Sin asignar';

            // Lista de objetivos en HTML
            /*const listaObjetivos = objetivos.length > 0
            ? objetivos.map(obj => `
                <li>
                    <input type="checkbox" ${obj.cumplido ? 'checked' : ''} disabled>
                    ${obj.texto}
                </li>
                `).join('')
            : '<li>No hay objetivos</li>';*/
            
            const fecha = new Date(fecha_creacion).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            // Crear tarjeta HTML
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('tarjeta-proyecto');
            //<p><strong>Creador:</strong> ${usuario?.nombre || 'Desconocido'} ${usuario?.apellidos || ''}</p>
            //<p><strong>Encargado(s):</strong> ${listaEncargados}</p>
            //<p><strong>Objetivos:</strong></p>
            //<ul>${listaObjetivos}</ul>
            tarjeta.innerHTML = `
            <div class="contenido-proyecto">
                <h3>${nombre}</h3>
                <p class="fecha"><strong>Creado:</strong> ${fecha}</p>
                <p><strong>Área:</strong> ${area}</p>
                <p>${descripcion}</p>
            </div>
            <div class="acciones-proyecto">
                <button>Editar</button>
                <button>+ Bitácora</button>
                <button>Ver Bitácoras</button>
                <button>Eliminar</button>
                <button>Completar</button>
            </div>
            `;

            proyectosContainer.appendChild(tarjeta);
        });
        } catch (error) {
        console.log('Error obteniendo los departamentos', error);
    }
}
