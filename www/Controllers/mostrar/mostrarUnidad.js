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

  // Create and append the button dynamically
  const buttonContainer = document.querySelector('.flex.justify-end');
  if (buttonContainer) {
      const button = document.createElement('button');
      button.className = 'px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple';
      button.textContent = 'Siguiente';
      button.onclick = function() {
          const selectedActivities = getSelectedActivities();
          const selectedActivityIds = selectedActivities.join(',');
          window.location.href = `config.html?id=${claseId}&activities=${selectedActivityIds}`;
      };
      
      buttonContainer.appendChild(button);
  }

  async function loadActividades() {
      try {
          const response = await fetch(showUnits_route);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const unidades = await response.json();
          
          console.log('Datos recibidos de la API:', unidades); // Debugging log

          if (Array.isArray(unidades) && unidades.length > 0) {
              const actividades = unidades[0].Actividades; // Adjust property name if necessary
              console.log('Actividades encontradas:', actividades); // Debugging log
              
              if (Array.isArray(actividades)) {
                  populateTable(actividades);
              } else {
                  console.error('No se encontraron actividades o el formato es incorrecto.');
              }
          } else {
              console.error('No se encontraron unidades o el formato es incorrecto.');
          }
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }

  function populateTable(actividades) {
      const tbody = document.querySelector('tbody');
      tbody.innerHTML = ''; // Clear existing rows

      actividades.forEach(actividad => {
          const row = document.createElement('tr');

          const checkboxCell = document.createElement('td');
          checkboxCell.className = 'px-4 py-3';
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'form-checkbox activity-checkbox';
          checkbox.value = actividad.Id; // Assuming each activity has an `Id` field
          checkboxCell.appendChild(checkbox);
          row.appendChild(checkboxCell);

          const nameCell = document.createElement('td');
          nameCell.className = 'px-4 py-3';
          nameCell.textContent = actividad.Nombre; // Assuming each activity has a `Nombre` field
          row.appendChild(nameCell);

          tbody.appendChild(row);
      });
  }

  function getSelectedActivities() {
      const checkboxes = document.querySelectorAll('.activity-checkbox:checked');
      const selectedIds = Array.from(checkboxes).map(checkbox => checkbox.value);
      return selectedIds;
  }

  // Initial load
  loadActividades();
});
