import { ArrowLeft, Send, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Destination } from "../data/destinations";
import type { ChatMessage } from "../types";

interface Props {
  destination: Destination;
  currentUser: { principal: string; displayName: string };
  onBack: () => void;
}

function getMessages(destId: string): ChatMessage[] {
  try {
    return JSON.parse(localStorage.getItem(`trillz_chat_${destId}`) || "[]");
  } catch {
    return [];
  }
}

function saveMessages(destId: string, messages: ChatMessage[]) {
  localStorage.setItem(`trillz_chat_${destId}`, JSON.stringify(messages));
}

const mockInitialMessages: Record<string, ChatMessage[]> = {
  gokarna: [
    {
      id: "g1",
      sender: "priya_travels",
      senderDisplay: "Priya S.",
      message: "Just arrived in Gokarna! The water is incredible 🌊",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "g2",
      sender: "beach_hopper",
      senderDisplay: "Rahul M.",
      message: "Which beach are you at? Om Beach or Kudle?",
      timestamp: new Date(Date.now() - 2400000).toISOString(),
    },
    {
      id: "g3",
      sender: "priya_travels",
      senderDisplay: "Priya S.",
      message: "Om Beach! Renting surfboards for ₹300/hr nearby 🏄",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
  ],
  rishikesh: [
    {
      id: "r1",
      sender: "adventure_ravi",
      senderDisplay: "Ravi K.",
      message: "Anyone up for rafting tomorrow? Looking for 4 people group 🚣",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "r2",
      sender: "yoga_life",
      senderDisplay: "Ananya R.",
      message: "Count me in! Which operator are you booking with?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  ladakh: [
    {
      id: "l1",
      sender: "moto_nomad",
      senderDisplay: "Vikram D.",
      message: "Manali-Leh highway is open! Bikes available at Leh market 🏍️",
      timestamp: new Date(Date.now() - 14400000).toISOString(),
    },
    {
      id: "l2",
      sender: "himalayan_soul",
      senderDisplay: "Sneha T.",
      message:
        "Pangong Lake was surreal yesterday. Take acclimatization seriously!",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
  ],
  dehradun: [
    {
      id: "d1",
      sender: "hill_lover",
      senderDisplay: "Arjun P.",
      message: "Robber's Cave is a must-do. Go early morning to avoid crowds!",
      timestamp: new Date(Date.now() - 10800000).toISOString(),
    },
    {
      id: "d2",
      sender: "nature_walks",
      senderDisplay: "Meera J.",
      message: "Anyone up for paragliding? Found a good deal at Mussoorie side",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
};

export function GroupChat({ destination, currentUser, onBack }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const stored = getMessages(destination.id);
    if (stored.length === 0 && mockInitialMessages[destination.id]) {
      const initial = mockInitialMessages[destination.id];
      saveMessages(destination.id, initial);
      return initial;
    }
    return stored;
  });
  const [input, setInput] = useState("");
  const joinedRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const destId = destination.id;
  const displayName = currentUser.displayName;
  const destName = destination.name;

  useEffect(() => {
    if (joinedRef.current) return;
    joinedRef.current = true;
    const joinMsg: ChatMessage = {
      id: `join-${Date.now()}`,
      sender: "system",
      senderDisplay: "System",
      message: `${displayName} joined the ${destName} traveler chat! 🎉`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => {
      const updated = [...prev, joinMsg];
      saveMessages(destId, updated);
      return updated;
    });
  }, [destId, displayName, destName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender: currentUser.principal,
      senderDisplay: currentUser.displayName,
      message: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => {
      const updated = [...prev, msg];
      saveMessages(destId, updated);
      return updated;
    });
    setInput("");
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: "oklch(0.18 0.045 236)" }}
    >
      <div
        className="flex items-center gap-3 px-5 pt-12 pb-4 border-b"
        style={{
          borderColor: "oklch(0.28 0.06 236)",
          background: "oklch(0.15 0.04 236)",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          data-ocid="chat.back.button"
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "oklch(0.22 0.055 236)" }}
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-white font-bold text-base">
            {destination.name} Travelers
          </h1>
          <div className="flex items-center gap-1 text-trillz-dim text-xs">
            <Users size={11} />
            <span>Public chat room</span>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full overflow-hidden">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.sender === currentUser.principal;
            const isSystem = msg.sender === "system";

            if (isSystem) {
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs"
                    style={{
                      background: "oklch(0.22 0.055 236)",
                      color: "oklch(0.65 0.03 236)",
                    }}
                  >
                    {msg.message}
                  </span>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[78%] ${isMe ? "items-end" : "items-start"} flex flex-col`}
                >
                  {!isMe && (
                    <span className="text-trillz-dim text-xs mb-1 ml-1">
                      {msg.senderDisplay}
                    </span>
                  )}
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "rounded-tr-sm text-white"
                        : "rounded-tl-sm text-white"
                    }`}
                    style={{
                      background: isMe
                        ? "oklch(0.68 0.175 54)"
                        : "oklch(0.25 0.06 236)",
                    }}
                  >
                    {msg.message}
                  </div>
                  <span className="text-trillz-dim/60 text-[10px] mt-1 mx-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div
        className="px-4 py-3 pb-28 flex items-center gap-2 border-t"
        style={{
          borderColor: "oklch(0.28 0.06 236)",
          background: "oklch(0.15 0.04 236)",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={`Message ${destination.name} travelers...`}
          data-ocid="chat.message.input"
          className="flex-1 px-4 py-3 rounded-2xl text-white placeholder-trillz-dim/50 focus:outline-none focus:ring-2 focus:ring-trillz-orange/50"
          style={{
            background: "oklch(0.27 0.065 236)",
            border: "1px solid oklch(0.32 0.06 236)",
          }}
        />
        <button
          type="button"
          onClick={sendMessage}
          data-ocid="chat.send.primary_button"
          disabled={!input.trim()}
          className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-40"
          style={{ background: "oklch(0.68 0.175 54)" }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
