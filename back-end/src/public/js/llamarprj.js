

export default async function mostrarContenido(idUsuario) {
    await fetch(`/api/proyectos/${idUsuario}`)
        .then(res => res.json())
        .then(proyectos => {
        const container = document.getElementById('proyectosContainer');
        container.innerHTML = ''; // Limpiar anteriores

        proyectos.forEach(proyecto => {
            const {
            nombre,
            descripcion,
            area,
            completado,
            usuario, //creador
            encargados, //usuarios
            objetivos // array de objetivos
            } = proyecto;

            // Lista de encargados
            const listaEncargados = encargados.map(enc => `${enc.nombre} ${enc.apellidos}`).join(', ') || 'Sin asignar';

            // Lista de objetivos en HTML
            const listaObjetivos = objetivos.length > 0
            ? objetivos.map(obj => `
                <li>
                    <input type="checkbox" ${obj.cumplido ? 'checked' : ''} disabled>
                    ${obj.texto}
                </li>
                `).join('')
            : '<li>No hay objetivos</li>';

            // Crear tarjeta HTML
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('tarjeta-proyecto');

            tarjeta.innerHTML = `
            <div class="contenido-proyecto">
                <h3>${nombre}</h3>
                <p><strong>Área:</strong> ${area}</p>
                <p>${descripcion}</p>
                <p><strong>Creador:</strong> ${usuario?.nombre || 'Desconocido'} ${usuario?.apellidos || ''}</p>
                <p><strong>Encargado(s):</strong> ${listaEncargados}</p>
                <p><strong>Objetivos:</strong></p>
                <ul>${listaObjetivos}</ul>
            </div>
            <div class="acciones-proyecto">
                <button>Editar</button>
                <button>+ Bitácora</button>
                <button>Ver Bitácoras</button>
                <button>Eliminar</button>
                <button>Completar</button>
            </div>
            `;

            container.appendChild(tarjeta);
        });
        })
        .catch(err => {
        console.error('Error al cargar proyectos:', err);
        });
}

