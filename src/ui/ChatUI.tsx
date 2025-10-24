import { useState } from "react";
import type { FormEvent } from "react";

type Message = { id: string; text: string; sender: "friend" | "me" };
let messageCounter = 0;
const nextMessageId = () => `msg-${++messageCounter}`;
const initialMessages: Message[] = [
	{ id: nextMessageId(), text: "Hey there!", sender: "friend" },
	{ id: nextMessageId(), text: "Hi 👋", sender: "me" },
];

export default function ChatUI() {
	const [messages, setMessages] = useState<Message[]>(initialMessages);
	const [input, setInput] = useState("");

	const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const trimmed = input.trim();
		if (!trimmed) return;

		const newMessage: Message = {
			id: nextMessageId(),
			text: trimmed,
			sender: "me",
		};
		setMessages((prev) => [...prev, newMessage]);
		setInput("");
	};

	return (
		<div className="min-h-screen flex flex-col bg-[#0d0d0d] text-white">
			<header className="p-4 bg-[#1a1a1a] flex justify-between items-center shadow">
				<a href="/friends" className="text-[#61dafb] hover:underline">
					← Back
				</a>
				<h1 className="text-xl font-semibold">Chat</h1>
				<div></div>
			</header>

			<div className="flex-1 overflow-y-auto p-4 space-y-3">
				{messages.map((msg) => (
					<div
						key={msg.id}
						className={`flex ${
							msg.sender === "me" ? "justify-end" : "justify-start"
						}`}
					>
						<div
							className={`p-3 rounded-lg max-w-xs ${
								msg.sender === "me"
									? "bg-[#61dafb] text-black"
									: "bg-[#1a1a1a] text-white"
							}`}
						>
							{msg.text}
						</div>
					</div>
				))}
			</div>

			<form
				onSubmit={sendMessage}
				className="p-4 bg-[#1a1a1a] flex gap-2 items-center"
			>
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Type a message..."
					className="flex-1 p-2 rounded-lg bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#61dafb] transition"
				/>
				<button
					type="submit"
					className="bg-[#61dafb] text-black px-4 py-2 rounded-lg hover:bg-[#52c0e5] transition"
				>
					Send
				</button>
			</form>
		</div>
	);
}
