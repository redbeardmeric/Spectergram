import type { AccountInfo } from "@azure/msal-browser";
import { msalInstance } from "./msalConfig";

// Helper to get configured API scopes from env
const envScope = (import.meta.env.VITE_API_SCOPE ?? "").trim();
const defaultApiScopes = envScope ? envScope.split(/\s+/) : [];

export async function getAccessToken(scopes?: string[]): Promise<string> {
    const requestScopes = (scopes && scopes.length > 0) ? scopes : (defaultApiScopes.length ? defaultApiScopes : ["openid", "profile", "email"]);

    let account: AccountInfo | null = null;
    const accounts = msalInstance.getAllAccounts();
    if (accounts && accounts.length > 0) account = accounts[0];

    if (!account) {
        // No signed-in account, trigger interactive login
        await msalInstance.loginPopup({ scopes: requestScopes }).catch((err) => {
            console.error("loginPopup failed:", err);
            throw err;
        });
        const accountsAfter = msalInstance.getAllAccounts();
        account = accountsAfter && accountsAfter.length > 0 ? accountsAfter[0] : null;
    }

    if (!account) throw new Error("No active account after login");

    try {
        const resp = await msalInstance.acquireTokenSilent({ account, scopes: requestScopes });
        return resp.accessToken;
    } catch (_err) {
        // Silent failed, fall back to popup
        const resp = await msalInstance.acquireTokenPopup({ account, scopes: requestScopes });
        return resp.accessToken;
    }
}

export async function fetchWithToken(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const token = await getAccessToken();
    const headers = new Headers(init?.headers as HeadersInit | undefined);
    headers.set("Authorization", `Bearer ${token}`);

    const opts: RequestInit = {
        ...init,
        headers,
    };

    return fetch(input, opts);
}

export default {
    getAccessToken,
    fetchWithToken,
};
