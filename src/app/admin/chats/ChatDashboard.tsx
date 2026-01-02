"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Send, Loader2, User as UserIcon, MessageCircle } from "lucide-react";
import { getChatMessages, sendChatMessage, getAdminChatList } from "@/lib/actions/chat";
import Image from "next/image";

export default function ChatDashboard({ initialChatList }: { initialChatList: any[] }) {
  const [chatList, setChatList] = useState(initialChatList);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll for chat list and messages
  useEffect(() => {
    const fetchChatList = async () => {
      const list = await getAdminChatList();
      setChatList(list);
    };

    const fetchMessages = async () => {
      if (selectedUser) {
        const msgs = await getChatMessages(selectedUser.id);
        setMessages(msgs);
      }
    };

    const interval = setInterval(() => {
      fetchChatList();
      fetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      const loadMessages = async () => {
        const msgs = await getChatMessages(selectedUser.id);
        setMessages(msgs);
      };
      loadMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedUser || isLoading) return;

    setIsLoading(true);
    try {
      await sendChatMessage(inputValue, selectedUser.id);
      setInputValue("");
      const msgs = await getChatMessages(selectedUser.id);
      setMessages(msgs);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredChatList = chatList.filter((chat) =>
    chat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white border border-[#E5E5E5] h-[700px] flex overflow-hidden">
      {/* Sidebar - Chat List */}
      <div className="w-1/3 border-r border-[#E5E5E5] flex flex-col">
        <div className="p-4 border-b border-[#E5E5E5]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" size={14} />
            <input
              type="text"
              placeholder="Cari pembeli..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F5F5F5] border-none text-[11px] focus:ring-1 focus:ring-[#1A1A1A] outline-none"
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          {filteredChatList.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[10px] uppercase tracking-widest text-[#999999]">Tidak ada chat</p>
            </div>
          ) : (
            filteredChatList.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-[#FDFCFB] transition-colors border-b border-[#F5F5F5] ${
                  selectedUser?.id === user.id ? "bg-[#FDFCFB] border-r-2 border-r-[#1A1A1A]" : ""
                }`}
              >
                <div className="relative w-10 h-10 bg-[#F5F5F5] rounded-full overflow-hidden flex-shrink-0">
                  {user.image ? (
                    <Image src={user.image} alt={user.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#999999]">
                      <UserIcon size={20} />
                    </div>
                  )}
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-[11px] font-black uppercase truncate">{user.name || "User"}</p>
                  <p className="text-[9px] text-[#999999] truncate mt-0.5">
                    {user.messages[0]?.content || "Mulai chat..."}
                  </p>
                </div>
                {user.messages[0] && (
                  <span className="ml-auto text-[8px] text-[#CCCCCC] uppercase tracking-tighter">
                    {new Date(user.messages[0].createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col bg-[#FDFCFB]">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-[#E5E5E5] flex items-center gap-3">
              <div className="w-8 h-8 bg-[#F5F5F5] rounded-full overflow-hidden flex-shrink-0">
                {selectedUser.image ? (
                  <Image src={selectedUser.image} alt={selectedUser.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#999999]">
                    <UserIcon size={16} />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-[11px] font-black uppercase">{selectedUser.name}</h3>
                <p className="text-[9px] text-[#999999]">{selectedUser.email}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-4 text-[11px] leading-relaxed shadow-sm ${
                      msg.isAdmin
                        ? "bg-[#1A1A1A] text-white"
                        : "bg-white border border-[#E5E5E5] text-[#1A1A1A]"
                    }`}
                  >
                    {msg.content}
                    <p className={`text-[7px] mt-2 uppercase tracking-widest ${msg.isAdmin ? "text-[#666666]" : "text-[#999999]"}`}>
                      {new Date(msg.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-[#E5E5E5] flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tulis balasan untuk pelanggan..."
                className="flex-grow bg-[#F5F5F5] border-none px-6 py-3 text-[11px] focus:ring-1 focus:ring-[#1A1A1A] outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-8 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.2em] font-black hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Kirim
              </button>
            </form>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-12">
            <MessageCircle size={48} className="text-[#E5E5E5] mb-6" strokeWidth={1} />
            <h3 className="text-[12px] font-black uppercase tracking-[0.2em] mb-2">Pilih Percakapan</h3>
            <p className="text-[10px] uppercase tracking-widest text-[#999999] max-w-[250px] leading-relaxed">
              Pilih salah satu pembeli di sebelah kiri untuk mulai membalas pesan mereka.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
