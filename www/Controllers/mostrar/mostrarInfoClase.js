document.addEventListener('DOMContentLoaded', function() {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const claseId = getQueryParam('id');
    if (!claseId) {
        console.error('No se proporcionó el ID de la clase');
        return;
    }

    var token = localStorage.getItem('token');

    fetch(showClassWithId_route + claseId, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener la clase');
        }
        return response.json();
    })
    .then(data => {
        const CodigoClase = data.CodigoClase;
        document.getElementById('codigo-clase').innerText = `Código de la clase: ${CodigoClase}`;
        const Nombre = data.Nombre;
        document.getElementById('nombre-clase').innerText = `Nombre de la clase: ${Nombre}`;
    })
    .catch(error => {
        console.error(error);
    });
});
