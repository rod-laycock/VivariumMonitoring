# Bruno Scripts Setup

## Environment Configuration

This collection uses environment variables to securely store API keys and other sensitive information.

### Initial Setup

1. Copy the example environment file:
   ```bash
   cp environments/Local.bru.example environments/Local.bru
   ```

2. Edit `environments/Local.bru` and replace `YOUR_API_KEY_HERE` with your actual API key

3. In Bruno, select the **Local** environment from the environment dropdown (top-right corner)

### Important Notes

- `environments/Local.bru` is in `.gitignore` and will NOT be committed to source control
- `environments/Local.bru.example` serves as a template for other developers
- Always use `{{apiKey}}` and `{{baseUrl}}` variables in your requests instead of hardcoded values

### Available Requests

- **Get All Data**: Retrieve paginated data with optional filters (`page`, `page_size`)
- **Insert Data**: Record new temperature/humidity data with random test values
