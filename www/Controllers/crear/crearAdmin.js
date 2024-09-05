function addUser(event) {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    fetch(createaccount_route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            NombreCompleto: fullName,
            Correo: email,
            Contrasena: password,
            NivelCuenta: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data === "Usuario registrado con éxito") {
            // Cerrar el modal
            const modalData = document.querySelector('[x-data]').__x.$data;
            modalData.isAddUserModalOpen = false;

            // Vaciar los campos del formulario
            document.getElementById('fullName').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            document.getElementById('confirmPassword').value = '';

            // Mostrar mensaje de éxito temporalmente
            const successMessage = document.getElementById('success-message');
            successMessage.textContent = "Usuario creado exitosamente";
            successMessage.classList.remove('hidden');

            // Ocultar el mensaje de éxito después de 30 segundos
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 10000);

            mostrarUsuarios();
        } else {
            // Mostrar mensaje de error
            const errorMsg = document.getElementById('error-msg');
            errorMsg.textContent = "Ya existe un usuario con el correo que estás ingresando";
            errorMsg.classList.remove('hidden');

            // Ocultar el mensaje de éxito después de 30 segundos
            setTimeout(() => {
                errorMsg.classList.add('hidden');
            }, 5000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
