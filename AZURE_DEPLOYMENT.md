# Azure Static Web Apps Configuration

## Deployment

This application is designed to be deployed on Azure Static Web Apps.

### Prerequisites
- Azure account
- Azure CLI installed
- GitHub repository

### Deployment Steps

1. **Create Azure Static Web App**:
   ```bash
   az staticwebapp create \
     --name spectergram \
     --resource-group your-resource-group \
     --source https://github.com/your-username/Spectergram \
     --location "Central US" \
     --branch main \
     --app-location "/" \
     --output-location "/"
   ```

2. **Configure Azure SignalR Service** (for production):
   ```bash
   az signalr create \
     --name spectergram-signalr \
     --resource-group your-resource-group \
     --sku Free_F1 \
     --location "Central US"
   ```

3. **Get SignalR Connection String**:
   ```bash
   az signalr key list \
     --name spectergram-signalr \
     --resource-group your-resource-group \
     --query primaryConnectionString \
     --output tsv
   ```

4. **Update signalr.js** with your Azure SignalR URL:
   - Replace the mock connection with real Azure SignalR connection
   - Update the `initialize()` method in SignalRManager class

### Local Development

For local development, the application uses localStorage to simulate real-time messaging:

```bash
# Simply open index.html in a web browser
# Or use a local web server:
python3 -m http.server 8000
# Then navigate to http://localhost:8000
```

### Environment Variables

For production deployment, configure these settings in Azure Static Web Apps:

- `SIGNALR_CONNECTION_STRING`: Your Azure SignalR Service connection string
- `AZURE_STATIC_WEB_APPS_API_TOKEN`: Automatically configured by Azure

### Security Considerations

1. **HTTPS Only**: Ensure the app is only accessible via HTTPS
2. **Content Security Policy**: Consider adding CSP headers
3. **CORS**: Configure CORS settings for SignalR endpoints
4. **Rate Limiting**: Implement rate limiting for message sending

### Monitoring

Use Azure Application Insights to monitor:
- Active connections
- Message throughput
- Encryption performance
- Error rates

### Cost Optimization

- Use Azure Static Web Apps Free tier for hosting
- Use Azure SignalR Service Free tier (supports up to 20 concurrent connections)
- Scale up only when needed
