// API configuration for different environments

interface ApiConfig {
	baseUrl: string;
}

function getApiConfig(): ApiConfig {
	// Check if we're in development mode
	const isDevelopment = import.meta.env.MODE === "development";

	// Check for environment-specific API URL
	const apiUrl = import.meta.env.VITE_API_URL;

	if (apiUrl) {
		// Use explicitly configured API URL
		return { baseUrl: apiUrl };
	}

	if (isDevelopment) {
		// Local development - use Azure Functions local runtime
		return { baseUrl: "http://localhost:7071/api" };
	}

	// Production - use Azure Functions URL
	// This will be set at build time via environment variables
	return {
		baseUrl: import.meta.env.VITE_API_URL || "/api",
	};
}

export const apiConfig = getApiConfig();

// Helper to construct full API URL
export function getApiUrl(path: string): string {
	// Ensure path starts with /api
	let cleanPath = path;
	if (!cleanPath.startsWith("/api")) {
		cleanPath = cleanPath.startsWith("/")
			? `/api${cleanPath}`
			: `/api/${cleanPath}`;
	}
	return `${apiConfig.baseUrl}${cleanPath}`;
}
