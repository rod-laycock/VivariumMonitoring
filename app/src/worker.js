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

    // Serve static assets from disk
    if (url.pathname === "/app.js" || url.pathname === "/style.css") {
      const assetPath = url.pathname.slice(1); // Remove leading '/'
      let asset = null;
      try {
        if (env.__STATIC_CONTENT && typeof env.__STATIC_CONTENT.get === 'function') {
          asset = await env.__STATIC_CONTENT.get(assetPath);
        }
      } catch (err) {
        console.error(`Error fetching static asset '${assetPath}':`, err);
      }
      if (asset) {
        const contentType = url.pathname.endsWith('.js') ? 'application/javascript' : 'text/css';
        return new Response(asset, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"
          }
        });
      } else {
        console.warn(`Static asset not found: ${assetPath}`);
        return new Response(`Not Found: ${assetPath}`, { status: 404 });
      }
    }

    // API endpoint to fetch data from the backend
    if (url.pathname === "/api/data") {
      console.log("Fetching data from API");
      return await fetchData(url, env);
    }

    console.log("Endpoint not found");
    return new Response("Not Found", { status: 404 });
  // ---------------------- STATIC ASSET DISK LOADER ----------------------
  async function getAssetFromDisk(assetPath, env) {
    // Wrangler dev mode exposes __STATIC_CONTENT as a KV namespace
    if (env.__STATIC_CONTENT && typeof env.__STATIC_CONTENT.get === 'function') {
      return await env.__STATIC_CONTENT.get(assetPath);
    }
    return null;
  }
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
  <link rel="stylesheet" href="/style.css">
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
  <script src="/app.js"></script>
</body>
</html>
  `;
}
