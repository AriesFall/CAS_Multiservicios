document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const claseId = getQueryParam('id');
    if (!claseId) {
        console.error('No se proporcionó el ID de la clase');
        return;
    } else {
        console.log('Clase ID:', claseId);
    }

    const token = localStorage.getItem('token');
    console.log('Token:', token);

    window.editarClase = function() {
        const nombreClaseEditado = document.getElementById('nombre-clase-input').value;
        console.log('Nombre de la clase editado:', nombreClaseEditado);

        fetch(editClass_route + claseId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ Nombre: nombreClaseEditado })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al editar la clase');
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            location.reload();
        })
        .catch(error => {
            console.error(error);
        });
    };

    window.eliminarClase = function() {
            fetch(deleteClass_route + claseId, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar la clase');
                }
                return response.json();
            })
            .then(data => {
                console.log('Respuesta del servidor:', data);
                window.location.href = '../teacher/index.html';
            })
            .catch(error => {
                console.error(error);
                alert('Error al eliminar la clase');
            });
        }
    });
