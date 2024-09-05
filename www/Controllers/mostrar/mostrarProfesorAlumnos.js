document.addEventListener('DOMContentLoaded', async function() {
    const selectElement = document.getElementById('claseSelect');
    const tableBody = document.querySelector('#alumnosTable tbody');
    const sortableHeader = document.querySelector('#alumnosTable th[data-sort="name"]');

    // Cargar las clases en el select
    try {
        const response = await fetch(showCreatedClasses_route, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('No se pudieron cargar las clases');
        
        const clases = await response.json();
        clases.forEach(clase => {
            const option = document.createElement('option');
            option.value = clase.Id;
            option.textContent = clase.Nombre;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar las clases:', error);
    }

    // Manejar el cambio en el select
    selectElement.addEventListener('change', async function() {
        const claseId = selectElement.value;
        
        if (!claseId) return;

        // Obtener los alumnos de la clase seleccionada
        const claseResponse = await fetch(`${showClassWithId_route}${claseId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!claseResponse.ok) throw new Error('No se pudieron cargar los alumnos');
        
        const clase = await claseResponse.json();
        const alumnosCorreos = clase.Alumnos;
        
        // Obtener nombres de los alumnos
        const nombresPromises = alumnosCorreos.map(correo => 
            fetch(`${getProfessorName_route}${correo}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response => response.json())
        );

        const nombres = await Promise.all(nombresPromises);

        // Limpiar la tabla
        tableBody.innerHTML = '';

        // Insertar los alumnos en la tabla
        const rows = nombres.map(nombre => {
            const row = document.createElement('tr');
            row.classList.add('bg-white', 'border-b', 'dark:bg-gray-800', 'dark:border-gray-700', 'hover:bg-gray-50', 'dark:hover:bg-gray-600');
            
            row.innerHTML = `
                <td class="w-4 p-4">
                    <div class="flex items-center"></div>
                </td>
                <th scope="row" class="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white md:px-6">
                    ${nombre.NombreCompleto}
                </th>
                <td class="px-2 py-4 md:px-6">Unidad 1</td>
                <td class="px-2 py-4 md:px-6">Cargando...</td>
            `;

            tableBody.appendChild(row);

            // Obtener el estado de las actividades
            fetch(`${showActivitiesStates_route}/${claseId}/${nombre.Correo}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response => {
                if (!response.ok) throw new Error('No se pudieron cargar las actividades');
                return response.json();
            }).then(actividades => {
                if (!actividades.length) {
                    row.querySelector('td:last-child').textContent = 'Sin actividades';
                    return;
                }
                const actividadesCompletadas = actividades.filter(a => a.Completada).length;
                const totalActividades = actividades.length;
                const promedio = Math.round((actividadesCompletadas / totalActividades) * 10);
                row.querySelector('td:last-child').textContent = `${promedio}/10`;
            }).catch(error => {
                console.error('Error al cargar el estado de las actividades:', error);
                row.querySelector('td:last-child').textContent = 'Error';
            });

            return row;
        });

        // Ordenar la tabla alfabéticamente por nombre
        const sortTable = (reverse = false) => {
            const sortedRows = Array.from(rows).sort((a, b) => {
                const nameA = a.querySelector('th').textContent.toLowerCase();
                const nameB = b.querySelector('th').textContent.toLowerCase();
                if (nameA < nameB) return reverse ? 1 : -1;
                if (nameA > nameB) return reverse ? -1 : 1;
                return 0;
            });
            tableBody.innerHTML = '';
            sortedRows.forEach(row => tableBody.appendChild(row));
        };

        // Añadir el evento click para ordenar
        sortableHeader.addEventListener('click', () => {
            const currentlySorted = sortableHeader.classList.contains('sorted-asc');
            sortableHeader.classList.toggle('sorted-asc', !currentlySorted);
            sortableHeader.classList.toggle('sorted-desc', currentlySorted);
            sortTable(currentlySorted);
        });

        // Inicialmente ordenar en orden ascendente
        sortTable();
    });
});
