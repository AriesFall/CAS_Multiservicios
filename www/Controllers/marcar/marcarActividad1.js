document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('listoBtn'); // Selecciona el botón por su id

    button.addEventListener('click', async function() {
        // Obtener los valores de las casillas
        const box0 = document.getElementById('box0').value.trim().toLowerCase();
        const box1 = document.getElementById('box1').value.trim().toLowerCase();
        const box2 = document.getElementById('box2').value.trim().toLowerCase();
        const box3 = document.getElementById('box3').value.trim().toLowerCase();

        // Concatenar los valores para formar la palabra
        const inputWord = box0 + box1 + box2 + box3;

        // Palabra a comparar
        const targetWord = 'leon';

        // Verificar si la palabra ingresada es igual a 'leon'
        if (inputWord === targetWord) {
            // Obtener el ID de la clase, el ID de la actividad de la URL, y el correo del localStorage
            const urlParams = new URLSearchParams(window.location.search);
            const claseId = urlParams.get('id');
            const actividadId = urlParams.get('actividadId');
            const correo = localStorage.getItem('correo');
            const token = localStorage.getItem('token'); // Asegúrate de tener el token en el localStorage

            // Verificar que los valores necesarios estén presentes
            if (!claseId || !actividadId || !correo || !token) {
                alert('Faltan datos para actualizar la actividad.');
                return;
            }

            // Enviar la solicitud PUT a la API
            try {
                const response = await fetch(`${markActivity_route}/${claseId}/${correo}/${actividadId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Asegúrate de tener el token en el localStorage
                    }
                });

                if (response.ok) {
                    alert('Estado de la actividad actualizado con éxito');
                } else {
                    alert('No se pudo actualizar el estado de la actividad');
                }
            } catch (error) {
                console.error('Error al actualizar el estado de la actividad:', error);
                alert('Error al actualizar el estado de la actividad');
            }
        } else {
            alert('La palabra ingresada no es correcta');
        }
    });
});
