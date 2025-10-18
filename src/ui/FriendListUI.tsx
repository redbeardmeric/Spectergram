import { useEffect, useState } from "react";

interface Friend {
  id: number;
  name: string;
  lastMessage: string;
}

export default function FriendListUI() {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    // TODO: Replace this mock with backend fetch
    setFriends([
      { id: 1, name: "Alice", lastMessage: "Hey, how are you?" },
      { id: 2, name: "Bob", lastMessage: "Let's catch up soon!" },
      { id: 3, name: "Charlie", lastMessage: "Got your message!" },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">
      <header className="p-4 bg-[#1a1a1a] flex justify-between items-center shadow">
        <h1 className="text-2xl font-semibold">Friends</h1>
        <a
          href="/chat"
          className="bg-[#61dafb] text-black px-3 py-1 rounded-lg hover:bg-[#52c0e5] transition"
        >
          Chat →
        </a>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {friends.map((f) => (
          <div
            key={f.id}
            className="bg-[#1a1a1a] p-4 rounded-lg hover:bg-[#252525] cursor-pointer transition"
          >
            <h2 className="text-lg font-medium">{f.name}</h2>
            <p className="text-gray-400 text-sm">{f.lastMessage}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
