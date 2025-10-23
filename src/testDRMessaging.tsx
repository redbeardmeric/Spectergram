import { useMemo, useRef, useState, useEffect } from 'react'

interface ConversationSummary {
  id: string
  name: string
  lastMessage: string
  unreadCount: number
}

interface Message {
  id: string
  conversationId: string
  sender: 'me' | 'them'
  text: string
  timestamp: number
}

function formatTime(ts: number): string {
  const date = new Date(ts)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function MessagingPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>(() => [
    { id: 'c1', name: 'Alice', lastMessage: 'See you soon!', unreadCount: 0 },
    { id: 'c2', name: 'Bob', lastMessage: 'Can you review this?', unreadCount: 2 },
    { id: 'c3', name: 'Charlie', lastMessage: 'Let’s catch up', unreadCount: 0 },
  ])

  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, Message[]>>({
    c1: [
      { id: 'm1', conversationId: 'c1', sender: 'them', text: 'Hey!', timestamp: Date.now() - 1000 * 60 * 60 },
      { id: 'm2', conversationId: 'c1', sender: 'me', text: 'Hi Alice, how are you?', timestamp: Date.now() - 1000 * 60 * 55 },
      { id: 'm3', conversationId: 'c1', sender: 'them', text: 'Doing great. See you soon!', timestamp: Date.now() - 1000 * 60 * 50 },
    ],
    c2: [
      { id: 'm4', conversationId: 'c2', sender: 'them', text: 'Can you review this?', timestamp: Date.now() - 1000 * 60 * 30 },
    ],
    c3: [
      { id: 'm5', conversationId: 'c3', sender: 'them', text: 'Let’s catch up', timestamp: Date.now() - 1000 * 60 * 10 },
    ],
  })

  const [activeConversationId, setActiveConversationId] = useState<string>('c1')
  const [draft, setDraft] = useState('')
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  const activeMessages = useMemo(() => messagesByConversation[activeConversationId] ?? [], [messagesByConversation, activeConversationId])
  const activeConversation = useMemo(() => conversations.find(c => c.id === activeConversationId), [conversations, activeConversationId])

  useEffect(() => {
    // Mark unread as read when opening
    setConversations(prev => prev.map(c => (c.id === activeConversationId ? { ...c, unreadCount: 0 } : c)))
  }, [activeConversationId])

  useEffect(() => {
    // Scroll to bottom on new messages
    const el = scrollContainerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [activeMessages.length])

  function handleSend() {
    const trimmed = draft.trim()
    if (!trimmed) return
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      conversationId: activeConversationId,
      sender: 'me',
      text: trimmed,
      timestamp: Date.now(),
    }
    setMessagesByConversation(prev => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] ?? []), newMessage],
    }))
    setConversations(prev => prev.map(c => (c.id === activeConversationId ? { ...c, lastMessage: trimmed } : c)))
    setDraft('')
  }

  return (
    <div className="h-screen flex bg-gray-50 text-gray-900">
      <aside className="w-72 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200 font-semibold">Messages</div>
        <div className="overflow-y-auto">
          {conversations.map((c) => (
            <button
              key={c.id}
              className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${c.id === activeConversationId ? 'bg-gray-100' : ''}`}
              onClick={() => setActiveConversationId(c.id)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{c.name}</span>
                {c.unreadCount > 0 && (
                  <span className="text-xs bg-blue-600 text-white rounded-full px-2 py-0.5">{c.unreadCount}</span>
                )}
              </div>
              <div className="text-sm text-gray-500 truncate">{c.lastMessage}</div>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="font-semibold">{activeConversation?.name ?? 'Select a conversation'}</div>
        </div>

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {activeMessages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${m.sender === 'me' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'}`}>
                <div className="whitespace-pre-wrap break-words">{m.text}</div>
                <div className={`mt-1 text-[10px] ${m.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>{formatTime(m.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="flex items-end gap-2">
            <textarea
              className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Type a message"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <button
              className="rounded-lg bg-blue-600 text-white px-4 py-2 disabled:opacity-50"
              onClick={handleSend}
              disabled={!draft.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
