export default {
  async fetch(request, env) {
    // Security: check API key
    const auth = request.headers.get("x-api-key");
    if (!auth || auth !== env.API_KEY) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const url = new URL(request.url);

    // GET = paged read
    if (request.method === "GET") {
      return await handleRead(env, url);
    }

    // POST = insert
    if (request.method === "POST") {
      return await handleInsert(request, env);
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }
};
// ---------------------- INSERT ----------------------

async function handleInsert(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { location_id, sensor_id, temperature, humidity } = body;

  if (
    typeof location_id !== "number" ||
    typeof sensor_id !== "number" ||
    typeof temperature !== "number" ||
    typeof humidity !== "number"
  ) {
    return json(
      {
        error: "Invalid parameters",
        expected: {
          location_id: "number",
          sensor_id: "number",
          temperature: "number",
          humidity: "number"
        }
      },
      400
    );
  }

  const now = new Date().toISOString();

  try {
    await env.DB.prepare(
      `INSERT INTO temp_humidity (date_time, location_id, sensor_id, temperature, humidity)
       VALUES (?, ?, ?, ?, ?)`
    )
      .bind(now, location_id, sensor_id, temperature, humidity)
      .run();

    return json({
      success: true,
      stored: { date_time: now, location_id, sensor_id, temperature, humidity }
    });
  } catch (err) {
    return json({ error: "Database error", details: err.message }, 500);
  }
}

// ---------------------- PAGED READ ----------------------

async function handleRead(env, url) {
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("page_size") || "50", 10);

  const offset = (page - 1) * pageSize;

  try {
    const location_id = url.searchParams.get("location_id");
    const sensor_id = url.searchParams.get("sensor_id");
    let whereClauses = [];
    let bindings = [];

    if (location_id) {
      whereClauses.push("location_id = ?");
      bindings.push(location_id);
    }
    if (sensor_id) {
      whereClauses.push("sensor_id = ?");
      bindings.push(sensor_id);
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // Count total rows (with or without filters)
    const countResult = await env.DB.prepare(
      `SELECT COUNT(*) AS count FROM temp_humidity ${whereSQL}`
    ).bind(...bindings).first();
    const total = countResult.count;
    const totalPages = Math.ceil(total / pageSize);

    // Fetch rows (with or without filters)
    const rows = await env.DB.prepare(
      `SELECT * FROM temp_humidity ${whereSQL} ORDER BY id DESC LIMIT ? OFFSET ?`
    ).bind(...bindings, pageSize, offset).all();

    return json({
      page,
      page_size: pageSize,
      total,
      total_pages: totalPages,
      data: rows.results
    });
  } catch (err) {
    return json({ error: "Database error", details: err.message }, 500);
  }
}

// ---------------------- UTIL ----------------------

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}