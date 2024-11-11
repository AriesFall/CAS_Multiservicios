async function loadQuotes() {
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('clientId');
    const quoteId = urlParams.get('quoteId');

    try {
        const response = await fetch(allQuotes_route);
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const quotes = await response.json();
        const filteredQuote = quotes.find(quote => quote.Id === quoteId && quote.ClientId === clientId);

        if (filteredQuote) {
            populateTable(filteredQuote);
        } else {
            console.log('No se encontró ninguna cotización que coincida con los filtros.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}


function populateTable(quote) {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = '';

    const ivaPercentage = quote.PercentageIVA;
    const ivaAmount = (quote.Price * ivaPercentage) / 100;
    const totalPrice = quote.Price + ivaAmount;

    const rowHTML = `
        <tr class="bg-white dark:bg-gray-800">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">1</th>
            <td class="px-6 py-4">${quote.NoCode}</td>
            <td class="px-6 py-4">${quote.ProductServiceName}</td>
            <td class="px-6 py-4">1</td>
            <td class="px-6 py-4">$${quote.Price.toFixed(2)}</td>
            <td class="px-6 py-4">$${quote.Price.toFixed(2)}</td>
        </tr>
    `;

    tableBody.innerHTML = rowHTML;

    const tableFooter = document.querySelector('table tfoot');
    tableFooter.innerHTML = `
        <tr class="font-semibold text-gray-900 dark:text-white">
            <th scope="row" class="px-6 py-3 text-base"></th>
            <td class="px-6 py-3"></td>
            <td class="px-6 py-3"></td>
            <td class="px-6 py-3"></td>
            <th scope="row" class="px-6 py-3 text-base">Subtotal (excl. IVA)</th>
            <td class="px-6 py-3">$${quote.Price.toFixed(2)}</td>
        </tr>
        <tr class="font-semibold text-gray-900 dark:text-white">
            <th scope="row" class="px-6 py-3 text-base"></th>
            <td class="px-6 py-3"></td>
            <td class="px-6 py-3"></td>
            <td class="px-6 py-3"></td>
            <th scope="row" class="px-6 py-3 text-base">+${ivaPercentage}% IVA</th>
            <td class="px-6 py-3">$${ivaAmount.toFixed(2)}</td>
        </tr>
        <tr class="font-semibold text-gray-900 dark:text-white">
            <th scope="row" class="px-6 py-3 text-base"></th>
            <td class="px-6 py-3"></td>
            <td class="px-6 py-3"></td>
            <td class="px-6 py-3"></td>
            <th scope="row" class="px-6 py-3 text-base">Precio Total (incl. IVA)</th>
            <td class="px-6 py-3">$${totalPrice.toFixed(2)}</td>
        </tr>
    `;
}

document.addEventListener('DOMContentLoaded', loadQuotes);

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quoteId = urlParams.get('quoteId');

    if (!quoteId) {
        document.getElementById('CotName').textContent = 'Client ID not found';
        return;
    }

    try {
        const response = await fetch(allQuotes_route);
        if (!response.ok) {
            throw new Error('Failed to fetch clients');
        }

        const quotes = await response.json();

        const quote = quotes.find(q => q.Id === quoteId);

        const quoteNameElement = document.getElementById('CotName');
        if (quote) {
            quoteNameElement.textContent = `Cotización No: ${quote.QuoteName}`;
        } else {
            quoteNameElement.textContent = 'Quote not found';
        }
    } catch (error) {
        console.error('Error fetching clients:', error);
        document.getElementById('CotName').textContent = 'Error fetching client data';
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('clientId');

    if (!clientId) {
        document.getElementById('cotClientId').textContent = 'Client ID not found';
        return;
    }

    try {
        const response = await fetch(allClients_route);
        if (!response.ok) {
            throw new Error('Failed to fetch clients');
        }

        const clients = await response.json();

        const client = clients.find(c => c.Id === clientId);

        const clientNameElement = document.getElementById('cotClientId');
        if (client) {
            if (client.Role === 1) {
                clientNameElement.textContent = `Cotización de: ${client.CompanyName}`;
            } else {
                clientNameElement.textContent = `Cotización de: ${client.Manager}`;
            }
        } else {
            clientNameElement.textContent = 'Client not found';
        }
    } catch (error) {
        console.error('Error fetching clients:', error);
        document.getElementById('cotClientId').textContent = 'Error fetching client data';
    }
});

const urlParams = new URLSearchParams(window.location.search);
const clientId = urlParams.get('clientId');
const quoteId = urlParams.get('quoteId');

async function changeStatus(event) {
    event.preventDefault(); // Evita el envío predeterminado del formulario
    
    if (!quoteId) {
        return;
    }

    // Obtener el estado seleccionado
    const statusSelect = event.target.querySelector('select');
    const selectedStatus = parseInt(statusSelect.value);

    if (isNaN(selectedStatus) || selectedStatus === 0) {
        return;
    }

    // Crear el cuerpo de la solicitud con el nuevo estado
    const updatedQuote = {
        status: selectedStatus
    };

    // URL de la API para actualizar el estado de la cotización
    const apiUrl = editQuote_route + quoteId;

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedQuote)
        });

        if (response.ok) {
            const result = await response.json();
            
            // Redirige a la ruta especificada
            window.location.href = `../cotizacion-vista2.html?clientId=${clientId}&quoteId=${quoteId}`;
            //`../pdfFormat.html?clientId=${clientId}&quoteId=${quoteId}`;
        } else {
            const error = await response.json();
            console.error("Error al actualizar la cotización:", error);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}