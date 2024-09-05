function unirseClase(event) {
    event.preventDefault();

    var codigoClase = document.getElementById('codigoClase').value;
    var token = localStorage.getItem('token');

    fetch(joinClass_route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ CodigoClase: codigoClase })
    })
    .then(response => response.json())
    .then(data => {
        if (data === "Te has unido a la clase con éxito") {
            const modalData = document.querySelector('[x-data]').__x.$data;
            modalData.isJoinClassModalOpen = false;

            document.getElementById('codigoClase').value = '';

            const successMessage = document.getElementById('success-message');
            successMessage.textContent = "Te has unido a la clase con éxito";
            successMessage.classList.remove('hidden');

            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 5000);

            mostrarClaseNombre();
        } else {
            const errorMsg = document.getElementById('error-msg');
            errorMsg.textContent = "Ya te has unido a esta clase";
            errorMsg.classList.remove('hidden');

            setTimeout(() => {
                errorMsg.classList.add('hidden');
            }, 5000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}