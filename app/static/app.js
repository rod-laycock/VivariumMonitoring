let currentPage = 1;
let pageSize = 50;
let totalPages = 1;
let locationFilter = null;
let sensorFilter = null;

function applyFilters() {
    const location = document.getElementById('location').value;
    const sensor = document.getElementById('sensor').value;
    const newPageSize = document.getElementById('pageSize').value;

    locationFilter = location ? parseInt(location) : null;
    sensorFilter = sensor ? parseInt(sensor) : null;
    pageSize = parseInt(newPageSize);
    currentPage = 1; // Reset to first page

    fetchData();
}

async function fetchData() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const dataContainer = document.getElementById('dataContainer');
    const stats = document.getElementById('stats');

    loading.style.display = 'block';
    error.style.display = 'none';
    dataContainer.style.display = 'none';
    stats.style.display = 'none';

    try {
    const params = new URLSearchParams({
        page: currentPage,
        page_size: pageSize
    });

    if (locationFilter) params.append('location_id', locationFilter);
    if (sensorFilter) params.append('sensor_id', sensorFilter);
    // Conditionally add debug param if present in the page URL
    if (window.location.search.includes('debug=1')) {
        params.append('debug', '1');
    }

    const response = await fetch('/api/data?' + params);
    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch (jsonErr) {
        loading.style.display = 'none';
        error.textContent = 'Error: Invalid JSON from API.\n' + text;
        error.style.display = 'block';
        return;
    }

    if (!response.ok || data.error) {
        loading.style.display = 'none';
        error.textContent = 'Error: ' + (data.error || response.statusText) + (data.details ? ('\nDetails: ' + data.details) : '') + (data.raw ? ('\nRaw: ' + data.raw) : '');
        error.style.display = 'block';
        return;
    }

    displayData(data);
    updatePagination(data);
    updateStats(data);

    loading.style.display = 'none';
    dataContainer.style.display = 'block';
    stats.style.display = 'grid';

    } catch (err) {
    loading.style.display = 'none';
    error.textContent = 'Error: ' + err.message;
    error.style.display = 'block';
    }
}

function displayData(data) {
    const tbody = document.getElementById('dataBody');
    tbody.innerHTML = '';

    if (!data.data || data.data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="no-data">No data available</td></tr>';
    return;
    }

    data.data.forEach(row => {
    const tr = document.createElement('tr');
    
    const date = new Date(row.date_time);
    const formattedDate = date.toLocaleString();

    tr.innerHTML = `
        <td>\${formattedDate}</td>
        <td>\${row.location_id}</td>
        <td>\${row.sensor_id}</td>
        <td class="temp">\${Number(row.temperature).toFixed(1)}°C</td>
        <td class="humidity">\${Number(row.humidity).toFixed(1)}%</td>
    `;
    
    tbody.appendChild(tr);
    });
}

function updatePagination(data) {
    totalPages = data.total_pages || 1;
    
    document.getElementById('prevBtn').disabled = currentPage <= 1;
    document.getElementById('nextBtn').disabled = currentPage >= totalPages;
    document.getElementById('pageInfo').textContent = `Page \${currentPage} of \${totalPages}`;
}

function updateStats(data) {
    document.getElementById('totalRecords').textContent = data.total || 0;
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
}

function previousPage() {
    if (currentPage > 1) {
    currentPage--;
    fetchData();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
    currentPage++;
    fetchData();
    }
}

// Initialize on page load
console.log("Page loaded, fetching initial data...");
fetchData();