document.addEventListener('DOMContentLoaded', function () {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const classId = getQueryParam('id');
    const correoAlumno = localStorage.getItem('correo');

    if (!classId || !correoAlumno) {
        console.error('No se proporcionaron todos los parámetros necesarios.');
        return;
    }

    async function loadActivities() {
        try {
            const response = await fetch(`${showActivitiesUnit_route}/${classId}/${correoAlumno}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const actividades = await response.json();

            if (Array.isArray(actividades)) {
                displayActivities(actividades);
            } else {
                console.error('La respuesta de la API no es una lista de actividades válida.');
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    }

    function displayActivities(actividades) {
        const container = document.querySelector('.grid');
        container.innerHTML = ''; // Limpiar el contenido existente

        actividades.forEach(actividad => {
            const activityElement = document.createElement('a');
            activityElement.href = `${actividad.Html}.html?id=${classId}&actividadId=${actividad.Id}`; // Suponiendo que `actividad.Id` es el identificador de la actividad
            activityElement.className = 'flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 mb-4';

            activityElement.innerHTML = `
                <div class="flex flex-col justify-between p-4 leading-normal">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${actividad.Nombre}</h5>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${actividad.Descripcion}</p>
                </div>
            `;

            container.appendChild(activityElement);
        });
    }

    loadActivities();
});
