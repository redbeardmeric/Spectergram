# API local development

This folder contains Azure Functions that implement the Spectergram API. Use this README to run and test the functions locally with Entra (Azure Active Directory) token validation.

Important: Never commit `local.settings.json` with real secrets. Use the example file below and keep secrets out of source control.

1) Create a local settings file

Copy the example to `local.settings.json` and fill in your values:

```bash
cp local.settings.example.json local.settings.json
# Edit local.settings.json and replace ENTRA_TENANT_ID, ENTRA_AUDIENCE and your DB connection string.
```

Key variables:
- `ENTRA_TENANT_ID`: your tenant id. Use `common` for multi-tenant testing.
- `ENTRA_AUDIENCE`: the audience your API expects (app id URI or client id). Example: `api://<client-id>` or the client id string.
- `JWKS_TTL`: optional, milliseconds to cache JWKS responses.
- `SqlConnection` in `ConnectionStrings`: connection string to your SQL Server for the API.

2) Install dependencies and build

```bash
cd api
npm install
npm run build
```

3) Run the Functions host locally

```bash
npm start
# or, to develop with auto-build in another terminal:
# npm run watch
# func start
```

4) Test a protected endpoint

You must call endpoints with an `Authorization: Bearer <token>` header where `<token>` is a JWT issued by Entra for the configured audience.

Quick way to get a token for testing (interactive):
- Use `az account get-access-token --resource <ENTRA_AUDIENCE>` if your CLI session can request tokens for that audience.
- Or use MSAL / Postman to request an access token for your API's scope.

Example curl (replace <TOKEN>):

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:7071/api/profile
```

If verification succeeds the function will run; otherwise you'll receive 401 Unauthorized.

If you want, I can also add a small debug function that echoes decoded claims to make testing easier.
