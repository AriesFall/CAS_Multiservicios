document.addEventListener('DOMContentLoaded', async function() {
    const claseSelect = document.getElementById('claseSelect');
    const actividadesTableBody = document.getElementById('actividadesTableBody');

    // Mapeo de IDs de actividad a nombres
    const actividadMapping = {
        '66b9af6995662dd632ffa85e': 'Actividad 1',
        '66b9af6995662dd632ffa85f': 'Actividad 2',
        '66b9af6995662dd632ffa85g': 'Actividad 3'
    };

    // Cargar clases en el select al cargar la página
    async function cargarClases() {
        try {
            const response = await axios.get(showClasses_route);
            const clases = response.data;

            // Llenar el select con las clases
            claseSelect.innerHTML = '';
            clases.forEach(clase => {
                const option = document.createElement('option');
                option.value = clase.Id;
                option.textContent = clase.Nombre;
                claseSelect.appendChild(option);
            });

            // Cargar actividades para la primera clase por defecto si existen clases
            if (clases.length > 0) {
                cargarActividades(clases[0].Id);
            }
        } catch (error) {
            console.error('Error al cargar las clases:', error);
        }
    }

    // Cargar actividades al seleccionar una clase
    async function cargarActividades(claseId) {
        const correoAlumno = localStorage.getItem('correo'); // Asume que el correo está guardado en localStorage

        try {
            const response = await axios.get(`${showActivitiesStates_route}/${claseId}/${correoAlumno}`);
            const actividades = response.data;

            // Limpiar la tabla
            actividadesTableBody.innerHTML = '';

            // Verificar si hay actividades y llenar la tabla
            if (actividades && actividades.length > 0) {
                actividades.forEach(actividad => {
                    const row = document.createElement('tr');
                    row.classList.add('bg-white', 'dark:bg-gray-800');

                    const actividadCell = document.createElement('th');
                    actividadCell.scope = 'row';
                    actividadCell.classList.add('px-6', 'py-4', 'font-medium', 'text-gray-900', 'whitespace-nowrap', 'dark:text-white');
                    // Cambia el ID de actividad por su nombre utilizando el mapeo
                    actividadCell.textContent = actividadMapping[actividad.ActividadId] || 'Actividad Desconocida';

                    const venceCell = document.createElement('td');
                    venceCell.classList.add('px-6', 'py-4');
                    venceCell.textContent = new Date(actividad.RangoFin).toLocaleDateString();

                    const estadoCell = document.createElement('td');
                    estadoCell.classList.add('px-6', 'py-4');
                    estadoCell.innerHTML = actividad.Completada
                        ? '<span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full"><i class="fas fa-check"></i></span>'
                        : '<span class="px-2 py-1 font-semibold leading-tight text-yellow-700 bg-yellow-100 rounded-full"><i class="fas fa-minus"></i></span>';

                    row.appendChild(actividadCell);
                    row.appendChild(venceCell);
                    row.appendChild(estadoCell);

                    actividadesTableBody.appendChild(row);
                });
            }
        } catch (error) {
            console.error('Error al cargar las actividades:', error);
            // Asegúrate de limpiar la tabla si hay un error
            actividadesTableBody.innerHTML = '';
        }
    }

    // Evento al cambiar la selección de clase
    claseSelect.addEventListener('change', function() {
        const claseId = claseSelect.value;
        cargarActividades(claseId);
    });

    // Inicializar la carga de clases
    cargarClases();
});
