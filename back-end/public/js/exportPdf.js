export function setupExportButton() {
  document.getElementById("exportPdfButton")?.addEventListener("click", () => {
    const doc = new window.jspdf.jsPDF();
    let y = 20;

    doc.setFontSize(18).text("Reporte de Proyectos", 20, y);
    y += 10;

    window.appProjects.forEach(p => {
      doc.setFontSize(14).text(`Nombre: ${p.nombre}`, 20, y += 10);
      doc.setFontSize(12).text(`Descripción: ${p.descripcion}`, 20, y += 8);
    });

    doc.save("proyectos.pdf");
  });
}
