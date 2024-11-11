async function createQuote(event) {
    event.preventDefault();

    const productServiceName = document.getElementById('productServiceName').value;
    const typeQuote = document.getElementById('typeQuote').value;
    const price = document.getElementById('price').value;
    const percentageIVA = document.getElementById('percentageIVA').value;
    const currency = document.getElementById('currency').value;
    const noCode = document.getElementById('noCode').value;
    const clientId = new URLSearchParams(window.location.search).get('clientId');

    const quoteData = {
        quoteName: "COT 0000-CMS0924",
        status: 1,
        typeQuote: parseInt(typeQuote),
        clientId,
        productServiceName,
        noCode,
        price: parseFloat(price),
        currency: parseInt(currency),
        percentageIVA: parseInt(percentageIVA)
    };

    try {
        const response = await fetch(addQuote_route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quoteData)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const result = await response.json();
        console.log('Cotización registrada:', result);

        const quoteId = result.id;
        window.location.href = `cotizacion-vista2.html?clientId=${clientId}&quoteId=${quoteId}`;

    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadQuotesTable() {
    try {
      // Obtener todas las cotizaciones y clientes
      const quotesResponse = await fetch(allQuotes_route);
      const clientsResponse = await fetch(allClients_route);
      
      const quotes = await quotesResponse.json();
      const clients = await clientsResponse.json();
      
      // Crear un mapa de clientes por ID para búsqueda rápida
      const clientsMap = {};
      clients.forEach(client => {
        clientsMap[client.Id] = client;
      });
  
      // Ordenar cotizaciones por fecha de más reciente a más antigua
      quotes.sort((a, b) => {
        const [dayA, monthA, yearA] = a.Date.split("/").map(Number);
        const [dayB, monthB, yearB] = b.Date.split("/").map(Number);
        const dateA = new Date(yearA + 2000, monthA - 1, dayA); // Ajuste para año corto
        const dateB = new Date(yearB + 2000, monthB - 1, dayB);
        return dateB - dateA;
      });
  
      // Seleccionar el cuerpo de la tabla
      const tableBody = document.getElementById("quotes-table-body");
      tableBody.innerHTML = ""; // Limpiar la tabla antes de llenarla
  
      quotes.forEach(quote => {
        const client = clientsMap[quote.ClientId];
        if (!client) return; // Saltar si no se encuentra el cliente
  
        // Definir información de cliente basada en el rol
        const clientName = client.Role === 1 ? client.CompanyName : client.Manager;
        const clientRoleDetail = client.Role === 1 ? client.Manager : "";
  
        // Definir ruta de imagen basada en el rol del cliente
        const clientImageSrc = client.Role === 1 
          ? `${viewImg_route + client.Email}.jpg` 
          : "../public/img/guess.jpg";
  
        // Definir estado en texto y color
        let statusText = "";
        let statusClass = "";
        switch (quote.Status) {
          case 1:
            statusText = "En curso";
            statusClass = "text-orange-700 bg-orange-100 dark:text-white dark:bg-orange-600";
            break;
          case 2:
            statusText = "Pendiente";
            statusClass = "text-gray-700 bg-gray-100 dark:text-gray-100 dark:bg-gray-700";
            break;
          case 3:
            statusText = "No aprobado";
            statusClass = "text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-700";
            break;
          case 4:
            statusText = "Aprobado";
            statusClass = "text-green-700 bg-green-100 dark:text-green-100 dark:bg-green-700";
            break;
        }
  
        // Crear la fila de la tabla
        const row = document.createElement("tr");
        row.classList.add("text-gray-700", "dark:text-gray-400");
  
        row.innerHTML = `
          <td class="px-4 py-3">
            <div class="flex items-center text-sm">
              <div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                <img
                  class="object-cover w-full h-full rounded-full"
                  src="${clientImageSrc}"
                  alt="${clientName}"
                  loading="lazy"
                />
                <div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
              </div>
              <div>
                <p class="font-semibold">${clientName}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">${clientRoleDetail}</p>
              </div>
            </div>
          </td>
          <td class="px-4 py-3 text-sm">
            $ ${quote.Price.toFixed(2)}
          </td>
          <td class="px-4 py-3 text-sm">
            ${quote.Date}
          </td>
          <td class="px-4 py-3 text-xs">
            <span class="px-2 py-1 font-semibold leading-tight ${statusClass} rounded-full">
              ${statusText}
            </span>
          </td>
        `;
  
        // Añadir la fila a la tabla
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error("Error al cargar las cotizaciones:", error);
    }
  }
  
  // Llamar a la función para cargar la tabla al cargar la página
  document.addEventListener("DOMContentLoaded", loadQuotesTable);
  
