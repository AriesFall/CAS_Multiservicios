let currentUserId = '';

function openEditUserModal(userId) {
    currentUserId = userId;

    // Cargar datos del usuario en el formulario
    const user = usuarios.find(user => user.Id === currentUserId);
    if (user) {
        document.getElementById('editUserName').value = user.NombreCompleto;
        document.getElementById('editUserEmail').value = user.Correo;
        document.getElementById('editUserRole').value = user.NivelCuenta;
        
        // Mostrar el modal
        document.querySelector('[x-data]').__x.$data.isEditUserModalOpen = true;
    }
}

document.getElementById('editUserForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('editUserName').value;
    const email = document.getElementById('editUserEmail').value;
    const password = document.getElementById('editUserPassword').value;
    const confirmPassword = document.getElementById('editUserConfirmPassword').value;
    const role = document.getElementById('editUserRole').value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    fetch(`updateUser_route/${currentUserId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
            NombreCompleto: name,
            Correo: email,
            Contrasena: password,
            NivelCuenta: parseInt(role)
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el usuario: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Actualizar la lista de usuarios y cerrar el modal
        mostrarUsuarios();
        document.querySelector('[x-data]').__x.$data.isEditUserModalOpen = false;
    })
    .catch(error => {
        console.error('Error al actualizar el usuario:', error);
    });
});
