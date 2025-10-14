import { useState } from "react";

export default function App() {
  const [activeFriend, setActiveFriend] = useState("Alex");

  const friends = [
    { name: "Alex", online: true },
    { name: "Dakota", online: true },
    { name: "James", online: false },
    { name: "Sushanta", online: true },
    { name: "Biraj", online: true },
  ];

  const messages = [
    { sender: "Alex", text: "Hey, how’s your UI coming along?" },
    { sender: "You", text: "Almost done! Retrospective is today 😅" },
    { sender: "Alex", text: "Nice! Let’s demo together later." },
  ];

  return (
    <div className="min-h-screen bg-[#0b0e16] text-gray-100 font-sans">
      {/* ✅ Header removed (it’s already in main.tsx) */}

      <div className="flex h-[calc(100vh-4rem)]">
        {/* 🧭 Friend List */}
        <aside className="w-1/4 bg-[#101522] border-r border-cyan-500/20 p-4 flex flex-col">
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">
            Friends List
          </h2>
          <ul className="space-y-2 overflow-y-auto">
            {friends.map((f) => (
              <li
                key={f.name}
                onClick={() => setActiveFriend(f.name)}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
                  activeFriend === f.name
                    ? "bg-cyan-500/20 border border-cyan-400"
                    : "hover:bg-[#1a1f2b]"
                }`}
              >
                <span
                  className={`h-3 w-3 rounded-full ${
                    f.online ? "bg-green-400" : "bg-gray-500"
                  }`}
                ></span>
                <span className="font-medium">{f.name}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* 💬 Chat Window */}
        <main className="flex-1 flex flex-col justify-between bg-[#0d111a] p-6">
          <div>
            <h2 className="text-xl font-semibold text-cyan-400 mb-2">
              Chat with {activeFriend}
            </h2>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto border-y border-cyan-500/10 py-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender === "You" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[70%] ${
                      msg.sender === "You"
                        ? "bg-cyan-500 text-black"
                        : "bg-[#1a1f2b] text-gray-200"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ✉️ Message Input */}
          <form className="mt-4 flex gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-[#1a1f2b] border border-cyan-500/20 rounded-full px-4 py-2 focus:outline-none focus:border-cyan-400 text-gray-100"
            />
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-2 rounded-full transition"
            >
              Send
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
