async function loginUser(event) {
    event.preventDefault();

    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const errorMsg = document.getElementById('error-msg');

    try {
        const response = await fetch(login_route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                correo,
                contrasena
            })
        });

        // Verifica si la respuesta no es exitosa
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Correo o contraseña incorrectos");
        }

        // Obtén los datos de la respuesta
        const result = await response.json();

        // Almacena los datos en localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('nivelCuenta', result.nivelCuenta);
        localStorage.setItem('correo', result.correo);

        // Verifica el nivel de cuenta y redirige al usuario
        const nivelCuenta = parseInt(result.nivelCuenta);
        if (nivelCuenta === 1) {
            window.location.href = './Views/admin/index.html';
        } else if (nivelCuenta === 2) {
            window.location.href = './Views/teacher/index.html';
        } else if (nivelCuenta === 3) {
            window.location.href = './Views/user/index.html';
        } else {
            throw new Error("Nivel de cuenta desconocido");
        }
    } catch (error) {
        // Muestra un mensaje de error si ocurre
        console.error('Error al iniciar sesión:', error.message);
        errorMsg.textContent = error.message;
        errorMsg.classList.remove('hidden');
        setTimeout(() => {
            errorMsg.classList.add('hidden');
            }, 5000);
    }
}
