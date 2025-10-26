import { fetchWithToken } from "../auth/msalHelpers";

export async function fetchMessages(): Promise<unknown> {
	const res = await fetchWithToken("/api/messages");
	if (!res.ok) throw new Error(`fetchMessages failed: ${res.status}`);
	return res.json();
}

export async function sendMessage(text: string): Promise<unknown> {
	const res = await fetchWithToken("/api/messages", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ text }),
	});
	if (!res.ok) throw new Error(`sendMessage failed: ${res.status}`);
	return res.json();
}

export default {
	fetchMessages,
	sendMessage,
};
