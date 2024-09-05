function crearClase() {
    var nombreClase = document.getElementById('nombreClase').value;
    var token = localStorage.getItem('token');

    fetch(createClass_route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ nombre: nombreClase })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al crear la clase');
        } else {
            mostrarClases();
        }
        return response.json();
    });
}

/*function crearClase() {
    var nombreClase = document.getElementById('nombreClase').value;
    var token = localStorage.getItem('token');

    fetch(createClass_route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ nombre: nombreClase })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al crear la clase');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('closeModal').innerText = `${data.mensaje}\nCódigo de la clase: ${data.codigo}`;
        mostrarClases();
    })
    .catch(error => {
        console.error('Error al crear la clase:', error);
        document.getElementById('mensajeCrearClase').innerText = 'Error al crear la clase. Consulta la consola para más detalles.';
    });
}*/