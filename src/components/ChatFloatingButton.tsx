"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { sendChatMessage, getChatMessages } from "@/lib/actions/chat";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatFloatingButton() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && session?.user) {
      const fetchMessages = async () => {
        const msgs = await getChatMessages();
        setMessages(msgs);
      };
      fetchMessages();
      interval = setInterval(fetchMessages, 5000);
    }
    return () => clearInterval(interval);
  }, [isOpen, session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!session?.user || (session.user as any).role === "ADMIN") return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await sendChatMessage(inputValue);
      setInputValue("");
      const msgs = await getChatMessages();
      setMessages(msgs);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-white border border-[#E5E5E5] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-[#1A1A1A] text-white flex justify-between items-center">
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-black">Scriptum Chat</h3>
                <p className="text-[8px] text-[#999999] uppercase tracking-widest mt-0.5">Admin akan segera membalas</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:opacity-70 transition-opacity">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-[#FDFCFB]">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <MessageCircle size={32} className="text-[#E5E5E5] mb-4" strokeWidth={1} />
                  <p className="text-[10px] uppercase tracking-widest text-[#999999] leading-relaxed">
                    Halo {session.user.name}, ada yang bisa kami bantu hari ini?
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isAdmin ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 text-[11px] leading-relaxed ${
                        msg.isAdmin
                          ? "bg-white border border-[#E5E5E5] text-[#1A1A1A]"
                          : "bg-[#1A1A1A] text-white"
                      }`}
                    >
                      {msg.content}
                      <p className={`text-[7px] mt-1 uppercase tracking-widest ${msg.isAdmin ? "text-[#999999]" : "text-[#666666]"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-[#E5E5E5] flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tulis pesan..."
                className="flex-grow bg-[#F5F5F5] border-none px-4 py-2 text-[11px] focus:ring-1 focus:ring-[#1A1A1A] outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="w-10 h-10 bg-[#1A1A1A] text-white flex items-center justify-center hover:bg-black transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform active:scale-95"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
