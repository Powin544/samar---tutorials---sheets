document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'AIzaSyC_meaviDUEyKadGRgwFRELWjvJ2rpFpm0'; // <-- Your API Key
    const sheetId = '1tpi4sKmb6q53KjuUa1ge39DHMPHxCWOYKu-cJX3w0d8'; // <-- Your Sheet ID
    const range = 'Sheet1!A2:D'; // Range of data

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    const table = document.getElementById('data-table');
    const tableBody = document.querySelector('#data-table tbody');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const searchInput = document.getElementById('search-input');

    table.classList.add('hidden');
    errorMessage.classList.add('hidden');

    let allRows = [];

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            loader.classList.add('hidden');
            table.classList.remove('hidden');

            const rows = data.values;
            if (!rows || rows.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4">No Data Found</td></tr>';
            } else {
                allRows = rows;
                renderTable(allRows);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            loader.classList.add('hidden');
            errorMessage.classList.remove('hidden');
            errorMessage.textContent = 'Failed to load data. Please try again later.';
        });

    function renderTable(rows) {
        tableBody.innerHTML = '';
        rows.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredRows = allRows.filter(row => {
            return row.some(cell => cell.toLowerCase().includes(searchTerm));
        });
        renderTable(filteredRows);
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(function(error) {
            console.log('Service Worker registration failed:', error);
        });
    }
});
