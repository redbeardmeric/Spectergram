import type React from "react";
import { useEffect, useState } from "react";

type Friend = {
	id: number;
	name: string;
	online: boolean;
};

type Message = {
	id: number;
	text: string;
	sender: string;
	time: string;
	seen: boolean;
	reactions: string[];
};

export default function ChatDashboard() {
	const [friends, setFriends] = useState<Friend[]>([]);
	const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");

	//  Settings + Profile
	const [showSettings, setShowSettings] = useState(false);
	const [showEditProfile, setShowEditProfile] = useState(false);
	const [darkMode, setDarkMode] = useState(true);

	//  Add Friend modal
	const [showAddFriendModal, setShowAddFriendModal] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<Friend[]>([]);
	const [showConfirmation, setShowConfirmation] = useState(false);

	//
	useEffect(() => {
		fetch("/api/friends")
			.then((res) => res.json())
			.then((data) => setFriends(data))
			.catch(() => console.log("⚠️ Could not load friends yet"));
	}, []);

	//  Fetch messages (Backend placeholder)
	useEffect(() => {
		if (!selectedFriend) return;
		fetch(`/api/messages/${selectedFriend.id}`)
			.then((res) => res.json())
			.then((data) => setMessages(data))
			.catch(() => console.log("⚠️ Could not load messages"));
	}, [selectedFriend]);

	//  Send message
	const sendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || !selectedFriend) return;

		const newMessage: Message = {
			id: Date.now(),
			text: input,
			sender: "me",
			time: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			seen: false,
			reactions: [],
		};

		setMessages((prev) => [...prev, newMessage]);
		setInput("");

		fetch(`/api/messages/${selectedFriend.id}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newMessage),
		}).catch(() => {});
	};

	//  Reactions
	const handleReaction = (id: number, emoji: string) => {
		setMessages((msgs) =>
			msgs.map((msg) =>
				msg.id === id
					? {
							...msg,
							reactions: msg.reactions.includes(emoji)
								? msg.reactions.filter((r) => r !== emoji)
								: [...msg.reactions, emoji],
						}
					: msg,
			),
		);
	};

	// 🔍 Search users
	const handleSearch = async (query: string) => {
		setSearchQuery(query);
		if (!query.trim()) return setSearchResults([]);

		try {
			const res = await fetch(`/api/users/search?query=${query}`);
			const data = await res.json();
			setSearchResults(data);
		} catch {
			console.log("⚠️ Could not search users");
		}
	};

	// ➕ Add friend
	const handleAddFriend = async (friendId: number) => {
		await fetch(`/api/friends/add`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ friendId }),
		});

		setShowConfirmation(true);
		setTimeout(() => setShowConfirmation(false), 2000); // auto close confirm

		fetch("/api/friends")
			.then((res) => res.json())
			.then((data) => setFriends(data));
	};

	return (
		<div
			className="min-h-screen flex flex-col fade-in"
			style={{
				backgroundColor: "var(--specter-bg)",
				color: "var(--specter-text)",
			}}
		>
			{/*  Header */}
			<header className="flex justify-between items-center p-4 border-b border-[#1f1f1f] shadow-[0_0_25px_rgba(97,218,251,0.2)] backdrop-blur-md bg-[rgba(10,10,10,0.7)]">
				<div className="flex items-center gap-3">
					<div className="specter-orb"></div>
					<h1 className="glow text-2xl font-bold tracking-wide">Spectergram</h1>
				</div>

				<div className="flex items-center gap-4">
					{/*  Commented out for next sprint */}
					{/*
          <button className="text-[#61dafb] hover:scale-110">📞</button>
          <button className="text-[#61dafb] hover:scale-110">🎥</button>
          */}
					<button
						type="button"
						onClick={() => setShowAddFriendModal(true)}
						className="text-[#61dafb] border border-[#61dafb] px-3 py-1 rounded-lg font-semibold hover:shadow-[0_0_15px_#61dafb] transition-all"
					>
						+ Add Friend
					</button>
					<button
						type="button"
						onClick={() => setShowSettings(true)}
						className="text-gray-400 hover:text-[#61dafb] transition-all text-xl"
					>
						⚙️
					</button>
				</div>
			</header>

			{/* 🟦 Layout */}
			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar */}
				<aside className="w-1/4 p-4 glass border-r border-[#2a2a2a]">
					<h2 className="text-lg font-semibold mb-4 glow text-[#61dafb]">
						Friends
					</h2>
					{friends.length === 0 && (
						<div className="empty-state mt-20 mx-auto max-w-sm text-gray-300">
							<div className="text-4xl mb-2">👋</div>
							<p className="font-semibold text-lg">No friends yet</p>
							<p className="text-sm text-[#61dafb] mt-2">
								Click “Add Friend” to get started
							</p>
						</div>
					)}

					{friends.map((friend) => (
						<button
							type="button"
							key={friend.id}
							onClick={() => setSelectedFriend(friend)}
							className={`w-full flex items-center justify-between p-3 mb-2 rounded-lg transition-all duration-200 ${
								selectedFriend?.id === friend.id
									? "bg-[#61dafb] text-black shadow-[0_0_15px_#61dafb]"
									: "bg-[#121212] hover:bg-[#1b1b1b]"
							}`}
						>
							<span>{friend.name}</span>
							<span
								className={`w-3 h-3 rounded-full ${
									friend.online
										? "bg-green-400 shadow-[0_0_8px_#22c55e]"
										: "bg-gray-500"
								}`}
							></span>
						</button>
					))}
				</aside>

				{/* Chat Section */}
				<section className="flex-1 flex flex-col bg-[#0a0a0a] relative">
					<div className="flex-1 overflow-y-auto p-6 space-y-4">
						{messages.length === 0 ? (
							<div className="empty-state mx-auto mt-32 max-w-sm text-gray-300">
								<div className="text-5xl mb-3">💬</div>
								<p className="font-semibold text-lg">No messages yet</p>
								<p className="text-sm text-[#61dafb] mt-1">
									Select a friend to start chatting
								</p>
							</div>
						) : (
							messages.map((msg) => (
								<div
									key={msg.id}
									className={`flex ${
										msg.sender === "me" ? "justify-end" : "justify-start"
									}`}
								>
									<div className="relative group max-w-xs">
										<div
											className={`p-3 rounded-xl ${
												msg.sender === "me"
													? "bg-gradient-to-br from-[#61dafb] to-[#3fa9f5] text-black shadow-[0_0_15px_rgba(97,218,251,0.4)]"
													: "bg-[#121212] text-white border border-[#1f1f1f] shadow-[0_0_10px_rgba(255,255,255,0.05)]"
											}`}
										>
											{msg.text}
											<p className="text-xs text-gray-400 mt-1">{msg.time}</p>
											{msg.sender === "me" && msg.seen && (
												<p className="text-xs text-[#61dafb] mt-1 text-right">
													Seen
												</p>
											)}
											<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
												<div className="reaction-bar flex gap-2 bg-[rgba(20,20,20,0.8)] backdrop-blur-sm px-3 py-1 rounded-full border border-[#2a2a2a] shadow-[0_0_15px_rgba(97,218,251,0.2)]">
													{["❤️", "😂", "👍", "🔥"].map((emoji) => (
														<button
															key={emoji}
															type="button"
															onClick={() => handleReaction(msg.id, emoji)}
															className="cursor-pointer hover:scale-110 transition-transform"
														>
															{emoji}
														</button>
													))}
												</div>
											</div>
											{msg.reactions.length > 0 && (
												<div className="flex gap-1 mt-1 text-sm">
													{msg.reactions.map((r, idx) => (
														<span key={`${msg.id}-${r}-${idx}`}>{r}</span>
													))}
												</div>
											)}
										</div>
									</div>
								</div>
							))
						)}
					</div>

					{/*  Input */}
					{selectedFriend && (
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
								className="bg-[#61dafb] text-black font-medium px-6 py-2 rounded-lg hover:scale-105 hover:shadow-[0_0_20px_#61dafb] transition-all duration-200"
							>
								Send
							</button>
						</form>
					)}
				</section>
			</div>

			{/*  Add Friend Modal */}
			{showAddFriendModal && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 fade-in">
					<div className="glass p-6 rounded-xl w-96 border border-[#2a2a2a] text-center">
						<h3 className="text-xl font-semibold mb-4 glow">
							Find & Add Friends
						</h3>
						<input
							type="text"
							placeholder="Search users..."
							value={searchQuery}
							onChange={(e) => handleSearch(e.target.value)}
							className="w-full mb-4 p-2 rounded bg-[#121212] text-white border border-[#2a2a2a] focus:border-[#61dafb] focus:shadow-[0_0_10px_#61dafb]"
						/>
						<div className="max-h-64 overflow-y-auto space-y-2">
							{searchResults.map((u) => (
								<div
									key={u.id}
									className="flex justify-between items-center p-2 rounded-lg bg-[#121212] hover:bg-[#1b1b1b] transition-all"
								>
									<span>{u.name}</span>
									<button
										type="button"
										onClick={() => handleAddFriend(u.id)}
										className="bg-[#61dafb] text-black px-3 py-1 rounded-md font-semibold hover:shadow-[0_0_10px_#61dafb]"
									>
										Add
									</button>
								</div>
							))}
							{searchResults.length === 0 && (
								<p className="text-gray-500 text-sm">No users found</p>
							)}
						</div>
						<button
							type="button"
							onClick={() => setShowAddFriendModal(false)}
							className="mt-5 px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white"
						>
							Close
						</button>
					</div>
				</div>
			)}

			{/*  Confirmation Popup */}
			{showConfirmation && (
				<div className="fixed bottom-10 right-10 bg-[#61dafb] text-black px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
					Friend added successfully ✅
				</div>
			)}

			{/* Settings Drawer */}
			{showSettings && (
				<div className="settings-drawer fixed top-0 right-0 h-full w-80 glass p-6 z-50 border-l border-[#2a2a2a] fade-in">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold glow">Settings</h2>
						<button
							type="button"
							onClick={() => setShowSettings(false)}
							className="text-gray-400 hover:text-[#61dafb] text-xl"
						>
							✖
						</button>
					</div>

					{/* Profile Section */}
					<div className="flex flex-col items-center mb-6">
						<div className="relative w-24 h-24 rounded-full border-4 border-[#61dafb] shadow-[0_0_25px_#61dafb] overflow-hidden">
							<img
								src="https://via.placeholder.com/100"
								alt="Profile"
								className="w-full h-full object-cover"
							/>
						</div>
						<h3 className="mt-3 text-lg font-semibold">Biraj Thapa</h3>
						<p className="text-gray-400 text-sm">bth030@latech.edu</p>

						<div className="flex items-center gap-2 mt-2">
							<span className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_#22c55e] animate-pulse" />
							<span className="text-sm text-gray-300">Online</span>
						</div>

						<button
							type="button"
							onClick={() => setShowEditProfile(true)}
							className="mt-4 px-4 py-2 bg-[#61dafb] text-black rounded-lg font-medium hover:scale-105 hover:shadow-[0_0_15px_#61dafb] transition-all"
						>
							Edit Profile
						</button>
					</div>

					{/* Settings Options */}
					<div className="space-y-4">
						<label className="flex justify-between items-center cursor-pointer">
							<span className="text-gray-300">Dark Theme</span>
							<input
								type="checkbox"
								className="accent-[#61dafb]"
								checked={darkMode}
								onChange={() => {
									const newTheme = !darkMode;
									setDarkMode(newTheme);
									document.body.classList.toggle("light-mode", !newTheme);
								}}
							/>
						</label>

						<label className="flex justify-between items-center cursor-pointer">
							<span className="text-gray-300">Show Online Status</span>
							<input
								type="checkbox"
								className="accent-[#61dafb]"
								checked
								readOnly
							/>
						</label>
					</div>
				</div>
			)}

			{/*  Edit Profile Modal */}
			{showEditProfile && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
					<div className="glass p-6 rounded-xl w-80 border border-[#2a2a2a]">
						<h3 className="text-lg font-semibold mb-3 glow">Edit Profile</h3>
						<input
							type="text"
							placeholder="Full Name"
							className="w-full mb-3 p-2 rounded bg-[#121212] text-white border border-[#2a2a2a]"
						/>
						<input type="file" className="w-full mb-3 text-sm text-gray-400" />
						<button
							type="button"
							className="w-full bg-[#61dafb] text-black font-semibold py-2 rounded-lg hover:shadow-[0_0_20px_#61dafb] transition-all"
							onClick={() => setShowEditProfile(false)}
						>
							Save
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
