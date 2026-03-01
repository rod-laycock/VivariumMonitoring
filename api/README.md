# Vivarium API

Temperature and humidity monitoring API built with Cloudflare Workers and D1.

## Setup

### Prerequisites
- Wrangler CLI installed (`npm install -g wrangler`)
- Cloudflare account

### Setting up secrets

This project uses Cloudflare Workers secrets to securely store sensitive values. Secrets are encrypted and never appear in your configuration files or source control.

**Required secret:**
- `API_KEY` - API key for authenticating requests

To set the API key secret:

```bash
wrangler secret put API_KEY
```

You'll be prompted to enter the secret value. Alternatively, for automation:

```bash
echo "your-api-key-here" | wrangler secret put API_KEY
```

### Deployment

```bash
wrangler deploy
```

## API Endpoints

### POST /
Insert temperature/humidity data

**Headers:**
- `x-api-key`: Your API key

**Body:**
```json
{
  "location_id": 1,
  "sensor_id": 1,
  "temperature": 22.5,
  "humidity": 45.0
}
```

### GET /
Retrieve paginated data

**Headers:**
- `x-api-key`: Your API key

**Query Parameters:**
- `page` (optional, default: 1)
- `page_size` (optional, default: 50)
- `location_id` (optional) - Filter by location
- `sensor_id` (optional) - Filter by sensor

## Database

Uses Cloudflare D1 database with binding name `DB`.

Table: `temp_humidity`
- `id` - Auto-increment primary key
- `date_time` - ISO timestamp
- `location_id` - Location identifier
- `sensor_id` - Sensor identifier
- `temperature` - Temperature reading
- `humidity` - Humidity reading
