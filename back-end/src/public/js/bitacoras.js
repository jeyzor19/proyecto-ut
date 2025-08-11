// js/bitacoras.js
let wired = false;

export function wireBitacoraModal() {
  if (wired) return;
  wired = true;

  const MODAL_ID = 'modal-bitacora';
  let proyectoActualId = null;

  const modal = () => document.getElementById(MODAL_ID);
  const show = () => {
    const m = modal();
    if (!m) return console.warn('No existe #modal-bitacora en el DOM');
    m.classList.remove('hidden');
    m.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    setTimeout(() => document.getElementById('bitacoraComentario')?.focus(), 0);
  };
  const hide = () => {
    const m = modal();
    if (!m) return;
    m.classList.add('hidden');
    m.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    proyectoActualId = null;
  };

  // Abrir desde botón "+ Bitácora"
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.btn-add-bitacora');
    if (!btn) return;

    proyectoActualId = btn.dataset.proyectoId;
    // limpia campos
    const t = document.getElementById('bitacoraTitulo');
    const c = document.getElementById('bitacoraComentario');
    if (t) t.value = '';
    if (c) c.value = '';
    show();
  });

  // Cerrar (X o backdrop)
  document.addEventListener('click', (ev) => {
    if (ev.target?.matches?.('[data-close-modal], .modal-backdrop')) hide();
  });

  // Guardar (llamando a /api/proyectos/bitacoras)
document.addEventListener('click', async (ev) => {
  if (ev.target?.id !== 'bitacoraGuardar') return;

  const guardarBtn = ev.target;
  const titulo = (document.getElementById('bitacoraTitulo')?.value || '').trim();
  const comentario = (document.getElementById('bitacoraComentario')?.value || '').trim();
  if (!comentario) { alert('Escribe un comentario.'); return; }

  guardarBtn.disabled = true;
  const prev = guardarBtn.textContent;
  guardarBtn.textContent = 'Guardando…';

  try {
    const resp = await fetch('/api/proyectos/bitacoras', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_proyecto: Number(proyectoActualId),
        titulo: titulo || null,
        comentario
      })
    });
    if (!resp.ok) {
      const err = await resp.json().catch(()=>null);
      throw new Error(err?.mensaje || 'No se pudo guardar la bitácora.');
    }

    // cerrar modal
    const m = document.getElementById('modal-bitacora');
    m?.classList.add('hidden');
    m?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    // (opcional) refrescar tarjetas manteniendo filtro actual
    const sel = document.querySelector('#lista-departamentos .dep-btn.selected');
    const depId = sel ? (sel.dataset.id || '') : '';
    if (window.filtrarProyectosPorDepartamento) {
      window.filtrarProyectosPorDepartamento(depId);
    }

    alert('Bitácora guardada.');
  } catch (e) {
    console.error(e);
    alert(e.message);
  } finally {
    guardarBtn.disabled = false;
    guardarBtn.textContent = prev;
  }
});



  // ESC para cerrar
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') hide();
  });
}


// === Ver Bitácoras (modal de lectura) ===
let wiredViewer = false;

export function wireBitacorasViewer() {
  if (wiredViewer) return;
  wiredViewer = true;

  const MODAL_ID = 'modal-bitacoras';
  let proyectoVerId = null;

  const modal = () => document.getElementById(MODAL_ID);
  const show = () => {
    const m = modal();
    if (!m) return console.warn('No existe #modal-bitacoras en el DOM');
    m.classList.remove('hidden');
    m.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };
  const hide = () => {
    const m = modal();
    if (!m) return;
    m.classList.add('hidden');
    m.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    proyectoVerId = null;
  };

  async function cargarBitacoras(proyectoId) {
    const cont = document.getElementById('bitacorasLista');
    if (!cont) return;
    cont.textContent = 'Cargando…';

    try {
      const r = await fetch(`/api/proyectos/bitacoras/proyecto/${proyectoId}`);
      if (!r.ok) throw new Error('No se pudieron cargar las bitácoras');
      const items = await r.json();

      if (!items || items.length === 0) {
        cont.innerHTML = `<div class="bitacoras-empty">Aún no hay bitácoras para este proyecto.</div>`;
        return;
      }

      cont.innerHTML = items.map(b => {
        const fecha = b.fecha ? new Date(b.fecha).toLocaleString('es-MX') : '';
        const titulo = b.titulo || 'Sin título';
        const comentario = b.comentario || '';
        return `
          <article class="bitacora-item">
            <header>
              <div class="titulo">${titulo}</div>
              <div class="fecha">· ${fecha}</div>
            </header>
            <div class="comentario">${comentario}</div>
          </article>
        `;
      }).join('');
    } catch (e) {
      console.error(e);
      cont.innerHTML = `<div class="bitacoras-empty">Error al cargar bitácoras.</div>`;
    }
  }

  // Abrir desde botón "Ver Bitácoras"
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.btn-ver-bitacoras');
    if (!btn) return;
    proyectoVerId = btn.dataset.proyectoId;
    show();
    cargarBitacoras(proyectoVerId);
  });

  // Cerrar (X o backdrop)
  document.addEventListener('click', (ev) => {
    if (ev.target?.matches?.('[data-close-modal], .modal-backdrop')) {
      // si está abierto este modal, ciérralo
      const m = ev.target.closest('#modal-bitacoras') || document.getElementById('modal-bitacoras');
      if (m && !m.classList.contains('hidden')) hide();
    }
  });

  // Cerrar con ESC
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      const m = document.getElementById('modal-bitacoras');
      if (m && !m.classList.contains('hidden')) hide();
    }
  });
}