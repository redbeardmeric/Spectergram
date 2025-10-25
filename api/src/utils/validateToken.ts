import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";

// Server-side Entra / Microsoft identity token verifier (CommonJS-friendly).
// Reads env vars (set in your Function App or local.settings.json):
// - ENTRA_TENANT_ID (or defaults to 'common')
// - ENTRA_AUDIENCE (the expected audience / client id / app-id-uri)

const tenantId = process.env.ENTRA_TENANT_ID || "common";
const expectedAudience =
	process.env.ENTRA_AUDIENCE || process.env.ENTRA_CLIENT_ID || "";

const issuer = `https://login.microsoftonline.com/${tenantId}/v2.0`;
const jwksUri = `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`;

type JWK = {
	kty: string;
	kid: string;
	use?: string;
	n?: string;
	e?: string;
	x5c?: string[];
	[k: string]: any;
};

let jwksCache: { keys: JWK[]; fetchedAt: number } | null = null;
const JWKS_TTL = parseInt(process.env.JWKS_TTL || "3600000", 10);

async function fetchJWKS(): Promise<JWK[]> {
	const now = Date.now();
	if (jwksCache && now - jwksCache.fetchedAt < JWKS_TTL) return jwksCache.keys;
	const res = await fetch(jwksUri);
	if (!res.ok) throw new Error(`Failed to fetch JWKS: ${res.status}`);
	const body: any = await res.json();
	const keys: JWK[] = body.keys || [];
	jwksCache = { keys, fetchedAt: now };
	return keys;
}

export async function verifyToken(token: string): Promise<any> {
	if (!token) throw new Error("No token provided");
	if (!expectedAudience)
		throw new Error(
			"No expected audience configured (ENTRA_AUDIENCE or ENTRA_CLIENT_ID)",
		);

	// Decode header to find kid
	const decodedHeader = jwt.decode(token, { complete: true }) as any;
	if (!decodedHeader || !decodedHeader.header)
		throw new Error("Invalid token header");
	const kid = decodedHeader.header.kid as string | undefined;

	const keys = await fetchJWKS();
	const jwk = kid ? keys.find((k) => k.kid === kid) : keys[0];
	if (!jwk) throw new Error("Unable to find matching JWK for token");

	// Convert JWK to PEM (handles x5c or modulus/exponent)
	const pem = jwkToPem(jwk as any);

	return new Promise((resolve, reject) => {
		jwt.verify(
			token,
			pem,
			{ algorithms: ["RS256"], issuer, audience: expectedAudience },
			(err, payload) => {
				if (err) return reject(err);
				resolve(payload);
			},
		);
	});
}

export function extractBearer(
	authorizationHeader?: string | null,
): string | null {
	if (!authorizationHeader) return null;
	const parts = authorizationHeader.split(" ");
	if (parts.length !== 2) return null;
	const [scheme, token] = parts;
	if (!/^Bearer$/i.test(scheme)) return null;
	return token;
}

export default { verifyToken, extractBearer };
