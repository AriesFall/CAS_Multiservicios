document.addEventListener('DOMContentLoaded', function () {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const classId = getQueryParam('id');
    const activityIds = getQueryParam('activities').split(',');

    if (!classId || !activityIds) {
        console.error('No se proporcionaron todos los parámetros necesarios en la URL.');
        return;
    }

    const alumnos = []; // Array para almacenar los datos de los alumnos

    async function loadClassData(classId) {
        try {
            const response = await fetch(showClassWithId_route + classId, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const clase = await response.json();

            if (clase && clase.Alumnos && Array.isArray(clase.Alumnos)) {
                for (let correo of clase.Alumnos) {
                    await obtenerNombreYIdPorCorreo(correo);
                }

                // Una vez que todos los datos se hayan obtenido, ordenar y agregar los alumnos a la tabla
                ordenarYAgregarAlumnosATabla();
            } else {
                console.error('No se encontraron alumnos o el formato es incorrecto.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function obtenerNombreYIdPorCorreo(correo) {
        try {
            const response = await fetch(getProfessorName_route + correo, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const usuario = await response.json();

            // Almacenar los datos del alumno en el array
            alumnos.push(usuario);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    function ordenarYAgregarAlumnosATabla() {
        // Ordenar el array de alumnos alfabéticamente por nombre
        alumnos.sort((a, b) => a.NombreCompleto.localeCompare(b.NombreCompleto));

        // Obtener el tbody de la tabla
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = ''; // Limpiar el contenido existente

        // Agregar los alumnos ordenados a la tabla
        alumnos.forEach(usuario => {
            const row = document.createElement('tr');
            row.className = 'text-gray-700 dark:text-gray-400';

            const checkboxCell = document.createElement('td');
            checkboxCell.className = 'px-4 py-3';
            checkboxCell.innerHTML = `
                <input type="checkbox" class="form-checkbox border-gray-400" data-id="${usuario.Correo}">
            `;
            row.appendChild(checkboxCell);

            const nombreCell = document.createElement('td');
            nombreCell.className = 'px-4 py-3';
            nombreCell.innerHTML = `
                <div class="flex items-center text-sm">
                    <div>
                        <p class="font-semibold">${usuario.NombreCompleto}</p>
                    </div>
                </div>
            `;
            row.appendChild(nombreCell);

            tbody.appendChild(row);
        });
    }

    async function assignActivitiesToStudents() {
        const selectedCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
        const selectedEmails = Array.from(selectedCheckboxes).map(checkbox => checkbox.getAttribute('data-id'));

        const startRange = document.getElementById('datepicker-range-start').value;
        const endRange = document.getElementById('datepicker-range-end').value;

        if (!startRange || !endRange) {
            alert('Por favor seleccione un rango de fechas.');
            return;
        }

        // Mapear a la estructura de ActividadesUnidad con rango de fechas
        const actividadesEstado = selectedEmails.map(email => ({
            CorreoAlumno: email,
            ClaseId: classId,  // Agregar ClaseId a cada objeto
            Actividades: activityIds.map(id => ({
                ActividadId: id,
                Completada: false,
                RangoInicio: new Date(startRange),
                RangoFin: new Date(endRange)
            }))
        }));

        try {
            const response = await fetch(assignActivity_route, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(actividadesEstado)
            });

            if (!response.ok) {
                throw new Error('Failed to assign activities');
            }

            alert('Actividades asignadas exitosamente.');
        } catch (error) {
            console.error('Error assigning activities:', error);
            alert('Error al asignar actividades.');
        }
    }

    const assignButton = document.querySelector('.flex.justify-end button');
    if (assignButton) {
        assignButton.onclick = assignActivitiesToStudents;
    }

    loadClassData(classId);
});