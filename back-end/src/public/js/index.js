
// VARIABLES GLOBALES

let selectedCard = null;


// ABRIR / CERRAR MODALES
function openModal(card) {
  selectedCard = card;
  const modalDetails = document.getElementById("modalDetails");
  modalDetails.innerHTML = card.innerHTML;
  document.getElementById("projectModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("projectModal").classList.add("hidden");
  selectedCard = null;
}

function openAddModal() {
  document.getElementById("addProjectModal").classList.remove("hidden");
}

function closeAddModal() {
  document.getElementById("addProjectModal").classList.add("hidden");
}

function openReportModal() {
  document.getElementById("reportModal").classList.remove("hidden");
}

function closeReportModal() {
  document.getElementById("reportModal").classList.add("hidden");
}

// CREAR NUEVO PROYECTO
document.getElementById("projectForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const area = document.getElementById("area").value.trim();
  const encargado = document.getElementById("encargado").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const progreso = parseInt(document.getElementById("progreso").value);

  if (!nombre || !area || !encargado || !descripcion || isNaN(progreso)) {
    alert("Por favor, completa todos los campos correctamente.");
    return;
  }

  const card = document.createElement("div");
  card.className = "card";
  card.setAttribute("onclick", "openModal(this)");
  card.innerHTML = `
    <p><strong>Nombre:</strong> ${nombre}</p>
    <p><strong>Área:</strong> ${area}</p>
    <p><strong>Encargado:</strong> ${encargado}</p>
    <p><strong>Descripción:</strong> ${descripcion}</p>
    <div class="progress-container">
      <span class="progress-label">${progreso}%</span>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: ${progreso}%"></div>
      </div>
    </div>
  `;

  if (progreso === 100) {
    card.classList.add("completo");
  }

  document.querySelector(".card-grid").appendChild(card);

  closeAddModal();
  document.getElementById("projectForm").reset();
});

// ACCIONES EN EL MODAL
function deleteProject() {
  if (selectedCard && confirm("¿Estás seguro de eliminar este proyecto?")) {
    selectedCard.remove();
    closeModal();
  }
}

function completeProject() {
  if (selectedCard) {
    const progressBar = selectedCard.querySelector(".progress-bar-fill");
    const label = selectedCard.querySelector(".progress-label");
    if (progressBar && label) {
      progressBar.style.width = "100%";
      label.textContent = "100%";
    }
    selectedCard.classList.add("completo");
    closeModal();
  }
}

// GENERAR INFORME PDF
document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const titulo = document.getElementById("informeTitulo").value;
  const comentario = document.getElementById("informeComentario").value;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const marginTop = 19;
  const marginBottom = 15.9;
  const marginLeft = 40;
  const marginRight = 25;
  const pageWidth = doc.internal.pageSize.getWidth();
  const usableWidth = pageWidth - marginLeft - marginRight;

  let cursorY = marginTop;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("INFORME DE PROYECTO", marginLeft, cursorY);
  cursorY += 10;

  doc.setFontSize(14);
  doc.text("Título del Informe:", marginLeft, cursorY);
  cursorY += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(titulo, marginLeft, cursorY);
  cursorY += 12;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Comentario:", marginLeft, cursorY);
  cursorY += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const lineHeight = 12 * 0.5;

  const lines = doc.splitTextToSize(comentario, usableWidth);
  lines.forEach((line) => {
    if (cursorY + lineHeight > doc.internal.pageSize.getHeight() - marginBottom) {
      doc.addPage();
      cursorY = marginTop;
    }
    doc.text(line, marginLeft, cursorY, { maxWidth: usableWidth, align: "justify" });
    cursorY += lineHeight;
  });

  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(
    "Generado automáticamente por el sistema",
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: "center" }
  );

  doc.save(`Informe_${titulo.replace(/\s+/g, "_")}.pdf`);

  closeReportModal();
  document.getElementById("reportForm").reset();
});

// CAMBIO DE VISTA GRID / LISTA
document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggleViewButton");
  const cardGrid = document.querySelector(".card-grid");

  if (toggleButton && cardGrid) {
    toggleButton.addEventListener("click", () => {
      cardGrid.classList.toggle("list-view");
    });
  }
});

document.getElementById('exportPdfButton').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const projects = document.querySelectorAll('.card');
  const marginLeft = 20;
  const marginTop = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const usableWidth = pageWidth - 2 * marginLeft;
  let cursorY = marginTop;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Reporte de Proyectos', marginLeft, cursorY);
  cursorY += 12;

  projects.forEach((card, index) => {
    if (cursorY > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      cursorY = marginTop;
    }

    // Extraer datos de la tarjeta
    const nombre = card.querySelector('p:nth-child(1)').textContent.replace('Nombre: ', '');
    const area = card.querySelector('p:nth-child(2)').textContent.replace('Área: ', '');
    const encargado = card.querySelector('p:nth-child(3)').textContent.replace('Encargado: ', '');
    const descripcion = card.querySelector('p:nth-child(4)').textContent.replace('Descripción: ', '');
    const progresoLabel = card.querySelector('.progress-label').textContent.replace('%', '');
    const progreso = parseInt(progresoLabel);

    // Estado
    const estado = progreso === 100 ? 'Completado' : 'Pendiente';

    // Escribir texto en PDF
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`Proyecto: ${nombre}`, marginLeft, cursorY);
    cursorY += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Área: ${area}`, marginLeft, cursorY);
    cursorY += 7;
    doc.text(`Encargado: ${encargado}`, marginLeft, cursorY);
    cursorY += 7;

    // Descripción puede ser larga: dividimos en líneas
    const descripcionLines = doc.splitTextToSize(`Descripción: ${descripcion}`, usableWidth);
    doc.text(descripcionLines, marginLeft, cursorY);
    cursorY += descripcionLines.length * 7;

    doc.text(`Progreso: ${progreso}%`, marginLeft, cursorY);
    cursorY += 7;

    doc.text(`Estado: ${estado}`, marginLeft, cursorY);
    cursorY += 12;

    // Línea separadora
    doc.setDrawColor(0);
    doc.setLineWidth(0.1);
    doc.line(marginLeft, cursorY, pageWidth - marginLeft, cursorY);
    cursorY += 12;
  });

  doc.save('Reporte_Proyectos.pdf');
});

const reportData = {
  titulo,
  comentario,
  fecha: new Date().toLocaleString(),
  proyecto: selectedCard ? selectedCard.querySelector("p")?.textContent || "Sin nombre" : "Desconocido",
  progreso: selectedCard?.querySelector(".progress-label")?.textContent || "0%",
  area: selectedCard?.querySelectorAll("p")[1]?.textContent || "",
  estado: selectedCard?.querySelector(".progress-label")?.textContent === "100%" ? "Completado" : "Pendiente"
};

const savedReports = JSON.parse(localStorage.getItem("reportes") || "[]");
savedReports.push(reportData);
localStorage.setItem("reportes", JSON.stringify(savedReports));

//Cerrar sesion
  document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.getElementById("logoutButton");

  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      // Si usas almacenamiento local para la sesión, puedes limpiarlo aquí
      // localStorage.clear();
      // sessionStorage.clear();

      // Redirige al login
      window.location.href = "login.html"; // Cambia esto si el login está en otra ruta
    });
  }
});
