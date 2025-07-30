export function toggleObjetivos() {
  const section = document.getElementById("objetivosSection");
  const toggle = document.getElementById("toggleObjetivos").checked;
  section.classList.toggle("hidden", !toggle);
}

export function agregarObjetivo() {
  const input = document.getElementById("nuevoObjetivo");
  const texto = input.value.trim();
  if (!texto) return;

  const ul = document.getElementById("listaObjetivos");
  const vacio = document.getElementById("listaObjetivosVacia");

  const li = document.createElement("li");
  li.textContent = texto;
  ul.appendChild(li);

  input.value = "";
  ul.classList.remove("hidden");
  vacio.classList.add("hidden");

  actualizarProgreso();
}

function actualizarProgreso() {
  const total = document.querySelectorAll("#listaObjetivos li").length;
  const completados = 0; // Puedes adaptar esto si se marcan como completados
  const porcentaje = total === 0 ? 0 : Math.round((completados / total) * 100);

  document.getElementById("contadorObjetivos").textContent = `${completados}/${total} objetivos`;
  document.getElementById("progresoTexto").textContent = `${porcentaje}% completado`;
  document.getElementById("progresoGlobal").style.width = `${porcentaje}%`;
}
