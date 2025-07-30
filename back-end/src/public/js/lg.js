document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault(); // Evita que el formulario se recargue

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  console.log("Datos enviados:", username, password);

  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: username, contrasena: password })
    });

    if (!res.ok) throw new Error("Credenciales inválidas");

    const data = await res.json();
    localStorage.setItem('usuario', JSON.stringify(data));

    if (data.rol === 'Admin') {
      window.location.href = 'dashboardusuarios.html';
    } else if (data.rol === 'DepLider') {
      window.location.href = 'deplider.html';
    } else {
      window.location.href = "usuario.html"
    }
    
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    const errorMsg = document.getElementById("login-error");
    if (errorMsg) {
      errorMsg.textContent = "Correo o contraseña incorrectos.";
    }
  }
});
