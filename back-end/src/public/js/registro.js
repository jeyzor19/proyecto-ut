document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const error = document.getElementById("register-error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtener valores
    const nombre = document.getElementById("nombre");
    const apellidos = document.getElementById("apellidos");
    const email = document.getElementById("email");
    const pass1 = document.getElementById("new-password");
    const pass2 = document.getElementById("confirm-password");

    // Limpiar estilos
    [nombre, apellidos, email, pass1, pass2].forEach(input => {
      input.style.borderColor = "";
    });
    error.textContent = "";

    // Validaciones
    let valido = true;

    if (!nombre.value.trim()) {
      nombre.style.borderColor = "red";
      valido = false;
    }
    if (!apellidos.value.trim()) {
      apellidos.style.borderColor = "red";
      valido = false;
    }
    if (!email.value.trim() || !email.value.endsWith("@uttn.mx")) {
      email.style.borderColor = "red";
      error.textContent = "El correo debe terminar en @uttn.mx";
      valido = false;
    }
    if (pass1.value.length < 8) {
      pass1.style.borderColor = "red";
      error.textContent = "La contraseña debe tener al menos 8 caracteres";
      valido = false;
    }
    if (pass1.value !== pass2.value) {
      pass2.style.borderColor = "red";
      error.textContent = "Las contraseñas no coinciden";
      valido = false;
    }

    if (!valido) return;

    // Enviar datos al backend
    try {
      const res = await fetch("http://localhost:3000/api/usuarios/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.value,
          apellidos: apellidos.value,
          correo: email.value,
          contrasena: pass1.value
        })
      });

      const data = await res.json();

      if (!res.ok) {
        error.textContent = data.mensaje || "Error al registrar usuario";
        return;
      }

      alert("✅ Usuario registrado correctamente. Ahora puedes iniciar sesión.");
      window.location.href = "login.html";
    } catch (err) {
      console.error("Error:", err);
      error.textContent = "❌ Error de conexión con el servidor.";
    }
  });
});
