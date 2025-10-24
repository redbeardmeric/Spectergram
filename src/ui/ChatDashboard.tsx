import { useState } from "react";
import type { FormEvent } from "react";

const friends = [
	{ id: 1, name: "Alice" },
	{ id: 2, name: "Bob" },
	{ id: 3, name: "Charlie" },
];

type Message = { id: string; text: string; sender: "friend" | "me" };
let messageCounter = 0;
const nextMessageId = () => `msg-${++messageCounter}`;
const initialMessages: Message[] = [
	{ id: nextMessageId(), text: "Hey there!", sender: "friend" },
	{ id: nextMessageId(), text: "Hi 👋", sender: "me" },
];

export default function ChatDashboard() {
	const [selectedFriend, setSelectedFriend] = useState(friends[0]);
	const [messages, setMessages] = useState<Message[]>(initialMessages);
	const [input, setInput] = useState("");

	const sendMessage = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const trimmed = input.trim();
		if (!trimmed) return;
		setMessages((prev) => [
			...prev,
			{ id: nextMessageId(), text: trimmed, sender: "me" },
		]);
		setInput("");
	};

	return (
		<div className="min-h-screen flex flex-col bg-[#050505] text-white fade-in">
			{/* 🌌 Glowing Header with Animated Orb Logo */}
			<header className="flex justify-between items-center p-4 border-b border-[#1f1f1f] shadow-[0_0_25px_rgba(97,218,251,0.2)] backdrop-blur-md bg-[rgba(10,10,10,0.7)] relative overflow-hidden">
				<div className="flex items-center gap-3">
					{/* Animated Spectergram Orb */}
					<div className="specter-orb"></div>
					<h1 className="glow text-2xl font-bold tracking-wide">Spectergram</h1>
				</div>
				<div className="text-sm text-gray-400">
					Chatting with{" "}
					<span className="text-[#61dafb]">{selectedFriend.name}</span>
				</div>
			</header>

			{/* 🟦 Chat Layout */}
			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar - Friends List */}
				<aside className="w-1/4 p-4 glass border-r border-[#2a2a2a]">
					<h2 className="text-lg font-semibold mb-4 glow text-[#61dafb]">
						Friends
					</h2>
					<ul className="space-y-2">
						{friends.map((friend) => {
							const isSelected = selectedFriend.id === friend.id;
							return (
								<li key={friend.id}>
									<button
										type="button"
										onClick={() => setSelectedFriend(friend)}
										aria-pressed={isSelected}
										className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
											isSelected
												? "bg-[#61dafb] text-black shadow-[0_0_15px_#61dafb]"
												: "bg-[#121212] hover:bg-[#1b1b1b]"
										}`}
									>
										{friend.name}
									</button>
								</li>
							);
						})}
					</ul>
				</aside>

				{/* 💬 Chat Section */}
				<section className="flex-1 flex flex-col bg-[#0a0a0a] relative">
					{/* Messages */}
					<div className="flex-1 overflow-y-auto p-6 space-y-4">
						{messages.map((msg) => (
							<div
								key={msg.id}
								className={`flex ${
									msg.sender === "me" ? "justify-end" : "justify-start"
								}`}
							>
								<div
									className={`p-3 rounded-xl max-w-xs ${
										msg.sender === "me"
											? "bg-gradient-to-br from-[#61dafb] to-[#3fa9f5] text-black shadow-[0_0_15px_rgba(97,218,251,0.4)]"
											: "bg-[#121212] text-white border border-[#1f1f1f] shadow-[0_0_10px_rgba(255,255,255,0.05)]"
									}`}
								>
									{msg.text}
								</div>
							</div>
						))}
					</div>

					{/* 📝 Message Input */}
					<form
						onSubmit={sendMessage}
						className="p-4 border-t border-[#1f1f1f] bg-[#0a0a0a] backdrop-blur-md flex gap-3 items-center"
					>
						<input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder={`Message ${selectedFriend.name}...`}
							className="flex-1 p-3 rounded-lg bg-[#121212] text-white border border-[#2a2a2a] focus:border-[#61dafb] focus:shadow-[0_0_10px_#61dafb] transition-all duration-200"
						/>
						<button
							type="submit"
							className="relative bg-[#61dafb] text-black font-medium px-6 py-2 rounded-lg hover:scale-105 hover:shadow-[0_0_20px_#61dafb] transition-all duration-200"
						>
							Send
						</button>
					</form>
				</section>
			</div>
		</div>
	);
}
