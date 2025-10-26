// Helper to get token from localStorage
function getAuthToken(): string | null {
	return localStorage.getItem("authToken");
}

// Helper to make authenticated requests
async function fetchWithAuth(
	input: RequestInfo,
	init?: RequestInit,
): Promise<Response> {
	const token = getAuthToken();
	if (!token) {
		throw new Error("No authentication token found. Please log in.");
	}

	const headers = new Headers(init?.headers);
	headers.set("Authorization", `Bearer ${token}`);
	headers.set("Content-Type", "application/json");

	return fetch(input, {
		...init,
		headers,
	});
}

// User login
export async function login(
	gmail: string,
	password: string,
): Promise<{ token: string; user: any }> {
	const res = await fetch("/api/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ gmail, password }),
	});

	if (!res.ok) {
		const error = await res.text();
		throw new Error(error || "Login failed");
	}

	const data = await res.json();
	// Store token in localStorage
	localStorage.setItem("authToken", data.token);
	localStorage.setItem("user", JSON.stringify(data.user));
	return data;
}

// User registration
export async function register(
	username: string,
	gmail: string,
	password: string,
): Promise<void> {
	const res = await fetch("/api/register", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username, gmail, password }),
	});

	if (!res.ok) {
		const error = await res.text();
		throw new Error(error || "Registration failed");
	}
}

// Logout
export function logout(): void {
	localStorage.removeItem("authToken");
	localStorage.removeItem("user");
}

// Get current user
export function getCurrentUser(): any | null {
	const userStr = localStorage.getItem("user");
	return userStr ? JSON.parse(userStr) : null;
}

// Fetch messages
export async function fetchMessages(): Promise<{
	messages: Array<{ from: string; message: string; timestamp: string }>;
}> {
	const res = await fetchWithAuth("/api/messages");
	if (!res.ok) throw new Error(`fetchMessages failed: ${res.status}`);
	return res.json();
}

// Send message
export async function sendMessage(
	to: string,
	message: string,
): Promise<{ message: string }> {
	const res = await fetchWithAuth("/api/messages", {
		method: "POST",
		body: JSON.stringify({ to, message }),
	});
	if (!res.ok) {
		const error = await res.text();
		throw new Error(error || `sendMessage failed: ${res.status}`);
	}
	return res.json();
}

// Fetch friends list
export async function fetchFriends(): Promise<{ friends: string[] }> {
	const res = await fetchWithAuth("/api/friends");
	if (!res.ok) throw new Error(`fetchFriends failed: ${res.status}`);
	return res.json();
}

// Add friend
export async function addFriend(
	friendUsername: string,
): Promise<{ message: string }> {
	const res = await fetchWithAuth("/api/friends", {
		method: "POST",
		body: JSON.stringify({ friendUsername }),
	});
	if (!res.ok) {
		const error = await res.text();
		throw new Error(error || `addFriend failed: ${res.status}`);
	}
	return res.json();
}

// Remove friend
export async function removeFriend(
	friendUsername: string,
): Promise<{ message: string }> {
	const res = await fetchWithAuth("/api/friends", {
		method: "DELETE",
		body: JSON.stringify({ friendUsername }),
	});
	if (!res.ok) {
		const error = await res.text();
		throw new Error(error || `removeFriend failed: ${res.status}`);
	}
	return res.json();
}

export default {
	login,
	register,
	logout,
	getCurrentUser,
	fetchMessages,
	sendMessage,
	fetchFriends,
	addFriend,
	removeFriend,
};
