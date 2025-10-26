# Spectergram Deployment Guide

This project uses a split deployment architecture:
- **Frontend**: Azure Static Web Apps
- **API**: Azure Functions (deployed separately)

## Why Split Deployment?

The API dependencies (especially `@azure/identity` SDK) exceed Azure Static Web Apps' 250MB size limit when packaged by Oryx. By deploying the API separately to Azure Functions, we bypass this limitation entirely.

## Prerequisites

1. Azure CLI installed
2. Azure subscription
3. GitHub repository secrets configured

## Azure Functions Setup

### 1. Create Azure Functions Apps

Create two Function Apps (one for production, one for development):

```bash
# Production
az functionapp create \
  --resource-group <your-resource-group> \
  --name spectergram-api \
  --storage-account <your-storage-account> \
  --runtime node \
  --runtime-version 22 \
  --functions-version 4 \
  --os-type Linux

# Development
az functionapp create \
  --resource-group <your-resource-group> \
  --name spectergram-api-dev \
  --storage-account <your-storage-account> \
  --runtime node \
  --runtime-version 22 \
  --functions-version 4 \
  --os-type Linux
```

### 2. Get Publish Profiles

```bash
# Production
az functionapp deployment list-publishing-profiles \
  --name spectergram-api \
  --resource-group <your-resource-group> \
  --xml

# Development
az functionapp deployment list-publishing-profiles \
  --name spectergram-api-dev \
  --resource-group <your-resource-group> \
  --xml
```

### 3. Add GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` - Production publish profile XML
- `AZURE_FUNCTIONAPP_PUBLISH_PROFILE_DEV` - Development publish profile XML

### 4. Configure CORS

Enable CORS for your Static Web Apps URLs:

```bash
# Production
az functionapp cors add \
  --name spectergram-api \
  --resource-group <your-resource-group> \
  --allowed-origins https://gray-dune-063d08f10.azurestaticapps.net

# Development
az functionapp cors add \
  --name spectergram-api-dev \
  --resource-group <your-resource-group> \
  --allowed-origins https://blue-sea-009eed610.azurestaticapps.net
```

### 5. Configure Environment Variables

Set the API URL as a build-time environment variable in your Static Web Apps configuration:

**For Production (main branch):**
```bash
az staticwebapp appsettings set \
  --name gray-dune-063d08f10 \
  --setting-names VITE_API_URL=https://spectergram-api.azurewebsites.net/api
```

**For Development (dev branch):**
```bash
az staticwebapp appsettings set \
  --name blue-sea-009eed610 \
  --setting-names VITE_API_URL=https://spectergram-api-dev.azurewebsites.net/api
```

## Local Development

For local development, the API URL defaults to `http://localhost:7071/api`.

To run locally:

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - API
cd api
npm start
```

## Deployment Workflow

### Frontend Deployment
- Pushes to `main` → Deploy to gray-dune (production)
- Pushes to `dev` → Deploy to blue-sea (development)

### API Deployment
- Changes in `api/` folder on `main` → Deploy to spectergram-api (production)
- Changes in `api/` folder on `dev` → Deploy to spectergram-api-dev (development)

## Troubleshooting

### API calls fail with CORS errors
- Verify CORS is configured on the Function App
- Check that the API URL environment variable is set correctly

### API deployment fails
- Verify publish profile secrets are configured
- Check that Function App names match in the workflow files

### Frontend can't connect to API
- Verify `VITE_API_URL` is set in Static Web App settings
- Rebuild the frontend to pick up the new environment variable

## Bundle Size Optimizations

The following optimizations have been applied:

### Frontend
- ✅ Lazy loading for all route components
- ✅ Manual chunk splitting for vendor libraries (React, Router, Auth)
- ✅ TanStack DevTools only load in development

### API (No longer relevant with split deployment)
- Original issue: Oryx created duplicate node_modules copies (~250MB+)
- Solution: Separate Azure Functions deployment bypasses Oryx entirely
