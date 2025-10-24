import { PublicClientApplication } from "@azure/msal-browser";

// MSAL configuration uses Vite env variables. 
const clientId = import.meta.env.VITE_MSAL_CLIENT_ID ?? "";
const tenantId = import.meta.env.VITE_MSAL_TENANT_ID ?? "common";

export const msalConfig = {
	auth: {
		clientId,
		// For Entra External Identities (B2C) you'd use a B2C authority/policy here.
		authority: `https://login.microsoftonline.com/${tenantId}`,
		redirectUri: window.location.origin,
	},
	cache: {
		cacheLocation: "localStorage",
		storeAuthStateInCookie: false,
	},
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest = {
	scopes: ["openid", "profile", "email"],
};
