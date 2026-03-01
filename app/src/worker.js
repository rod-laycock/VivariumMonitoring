export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    console.log("Received request: ", request.method, url.pathname);

    // Serve the main HTML page
    if (url.pathname === "/" || url.pathname === "/index.html") {
      console.log("Serving HTML page");
      return new Response(renderHTML(), {
        headers: { "Content-Type": "text/html" }
      });
    }

    // API endpoint to fetch data from the backend
    if (url.pathname === "/api/data") {
      console.log("Fetching data from API");
      return await fetchData(url, env);
    }

    console.log("Endpoint not found");
    return new Response("Not Found", { status: 404 });
  }
};

// ---------------------- FETCH DATA FROM API ----------------------

async function fetchData(url, env) {
  try {
    // Get query parameters
    const page = url.searchParams.get("page") || "1";
    const pageSize = url.searchParams.get("page_size") || "50";
    const locationId = url.searchParams.get("location_id");
    const sensorId = url.searchParams.get("sensor_id");

    // Build API URL
    const apiUrl = new URL(env.API_URL);

    console.log("Page: ", page);
    console.log("Page Size: ", pageSize);
    console.log("Location ID: ", locationId);
    console.log("Sensor ID: ", sensorId);

    apiUrl.searchParams.set("page", page);
    apiUrl.searchParams.set("page_size", pageSize);
    if (locationId) apiUrl.searchParams.set("location_id", locationId);
    if (sensorId) apiUrl.searchParams.set("sensor_id", sensorId);

    // Debug: return the URL and headers being used
    if (url.searchParams.get("debug") === "1") {
      return new Response(
        JSON.stringify({
          debug: true,
          apiUrl: apiUrl.toString(),
          headers: {
            "x-api-key": env.API_KEY,
            "content-type": "application/json"
          }
        }, null, 2),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch from API
    const response = await fetch(apiUrl.toString(), {
      headers: {
        "x-api-key": env.API_KEY,
        "content-type": "application/json"
      }
    });

    const rawText = await response.text();

    // Try to parse JSON, but if it fails, return the raw text for debugging
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (jsonErr) {
      return new Response(
        JSON.stringify({
          error: "Invalid JSON from API",
          details: jsonErr.message,
          raw: rawText
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: `API returned ${response.status}`,
          apiError: data,
          apiUrl: apiUrl.toString()
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch data", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// ---------------------- HTML RENDERING ----------------------

function renderHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vivarium - Temperature & Humidity Monitoring</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    header {
      text-align: center;
      color: white;
      margin-bottom: 40px;
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
    }

    .controls {apply
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      align-items: center;
    }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    label {
      font-size: 0.9rem;
      font-weight: 600;
      color: #555;
    }

    input, select, button {
      padding: 10px 15px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
    }

    input:focus, select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    button {
      background: #667eea;
      color: white;
      border: none;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s;
      align-self: flex-end;
    }

    button:hover {
      background: #5568d3;
    }

    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
apply
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 5px;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
    }

    .data-table {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background: #667eea;
      color: white;
    }

    th, td {
      padding: 15px;
      text-align: left;
    }

    th {
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    tbody tr {
      border-bottom: 1px solid #eee;
      transition: background 0.2s;
    }

    tbody tr:hover {
      background: #f5f5f5;
    }

    tbody tr:last-child {
      border-bottom: none;
    }

    td {
      color: #333;
    }

    .temp {
      color: #e74c3c;
      font-weight: 600;
    }

    .humidity {
      color: #3498db;
      font-weight: 600;
    }

    .pagination {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 20px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .pagination button {
      min-width: 100px;
    }

    .page-info {
      display: flex;
      align-items: center;
      font-weight: 600;
      color: #555;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: white;
      font-size: 1.2rem;
    }

    .error {
      background: #e74c3c;
      color: white;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      text-align: center;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 2rem;
      }

      .controls {
        flex-direction: column;
      }

      .control-group {
        width: 100%;
      }

      button {
        width: 100%;
      }

      table {
        font-size: 0.9rem;
      }

      th, td {
        padding: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🌿 Vivarium Monitor</h1>
      <p class="subtitle">Temperature & Humidity Data</p>
    </header>

    <div class="controls">
      <div class="control-group">
        <label for="location">Location ID</label>
        <input type="number" id="location" placeholder="All locations" min="1">
      </div>
      <div class="control-group">
        <label for="sensor">Sensor ID</label>
        <input type="number" id="sensor" placeholder="All sensors" min="1">
      </div>
      <div class="control-group">
        <label for="pageSize">Items per page</label>
        <select id="pageSize">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50" selected>50</option>
          <option value="100">100</option>
        </select>
      </div>
      <button onclick="applyFilters()">Apply Filters</button>
    </div>

    <div id="stats" class="stats" style="display: none;">
      <div class="stat-card">
        <div class="stat-label">Total Records</div>
        <div class="stat-value" id="totalRecords">-</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Current Page</div>
        <div class="stat-value" id="currentPage">-</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Pages</div>
        <div class="stat-value" id="totalPages">-</div>
      </div>
    </div>

    <div id="error" class="error" style="display: none;"></div>
    <div id="loading" class="loading">Loading data...</div>

    <div id="dataContainer" style="display: none;">
      <div class="data-table">
        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Location</th>
              <th>Sensor</th>
              <th>Temperature (°C)</th>
              <th>Humidity (%)</th>
            </tr>
          </thead>
          <tbody id="dataBody">
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button id="prevBtn" onclick="previousPage()" disabled>Previous</button>
        <div class="page-info">
          <span id="pageInfo">Page 1</span>
        </div>
        <button id="nextBtn" onclick="nextPage()" disabled>Next</button>
      </div>
    </div>
  </div>

  <script language="javascript">
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

        tr.innerHTML = \`
          <td>\${formattedDate}</td>
          <td>\${row.location_id}</td>
          <td>\${row.sensor_id}</td>
          <td class="temp">\${Number(row.temperature).toFixed(1)}°C</td>
          <td class="humidity">\${Number(row.humidity).toFixed(1)}%</td>
        \`;
        
        tbody.appendChild(tr);
      });
    }

    function updatePagination(data) {
      totalPages = data.total_pages || 1;
      
      document.getElementById('prevBtn').disabled = currentPage <= 1;
      document.getElementById('nextBtn').disabled = currentPage >= totalPages;
      document.getElementById('pageInfo').textContent = \`Page \${currentPage} of \${totalPages}\`;
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
  </script>
</body>
</html>
  `;
}
