'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { GiftIcon, Sent02Icon } from '@hugeicons/core-free-icons';
import { useGiftStore } from '@/store/useGiftStore';

const initialMessages = [
  { id: 1, user: '@GhostFan1', color: '#A78BFA', text: 'Bro just carried the whole squad', isGift: false },
  { id: 2, user: '@NaijaGamer', color: '#F472B6', text: 'This stream is too mad', isGift: false },
  { id: 3, user: '@AbujaBoy', color: '#34D399', text: "GG! Let's go Alpha!!", isGift: false },
  { id: 4, user: '@LagosVibes', color: '#F59E0B', text: 'Top 5 already?', isGift: false },
  { id: 5, user: '@CallOfNaija', color: '#F0B429', text: 'Drop the settings bro please', isGift: false },
  { id: 6, user: '@ZuluFanatic', color: '#F472B6', text: 'First time watching, this is insane', isGift: false },
  { id: 7, user: '@PH_Gamer', color: '#A78BFA', text: "1.2K viewers let's gooo", isGift: false },
  { id: 8, user: '@KanoKing', color: '#34D399', text: 'Clutch incoming, I can feel it', isGift: false },
];

const newMessages = [
  { user: '@LagosGamer', color: '#F59E0B', text: 'W player no cap', isGift: false },
  { user: '@AbujaVibes', color: '#F0B429', text: 'someone gift a sub pls', isGift: false },
  { user: '@NaijaKing', color: '#A78BFA', text: 'this man is cracked', isGift: false },
  { user: '@DeltaGamer', color: '#34D399', text: 'omo this is too much', isGift: false },
  { user: '@OgaStreamer', color: '#F472B6', text: 'carried by ghost again lol', isGift: false },
  { user: '@BenedictNG', color: '#F0B429', text: 'Lagos finest right here', isGift: false },
  { user: '@ChiGaming', color: '#F59E0B', text: 'how is he doing this???', isGift: false },
  { user: '@RiverState', color: '#A78BFA', text: 'represent PH!', isGift: false },
  { user: '@AbokiGamer', color: '#34D399', text: 'GG GG GG', isGift: false },
  { user: '@SaharaPlay', color: '#F472B6', text: 'subscribe guys he deserves it', isGift: false },
  // Gift messages mixed in
  { user: '@NaijaGamer', color: '#F0B429', text: 'sent 👑 Afro Crown · 10,000 VC', isGift: true },
  { user: '@LagosVibes', color: '#F0B429', text: 'sent 💎 Diamond Fang · 50,000 VC', isGift: true },
  { user: '@KanoKing', color: '#F0B429', text: 'sent ⚡ Lagos Storm · 25,000 VC', isGift: true },
];

export default function LiveChat() {
  const [messages, setMessages] = useState(initialMessages);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { openPicker } = useGiftStore();

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  // Simulate incoming live chat messages
  useEffect(() => {
    let nextMsgIndex = 0;
    const interval = setInterval(() => {
      const nextMsg = newMessages[nextMsgIndex];
      setMessages((prev) => {
        const updated = [
          ...prev,
          {
            id: Date.now() + Math.random(),
            user: nextMsg.user,
            color: nextMsg.color,
            text: nextMsg.text,
            isGift: nextMsg.isGift,
          },
        ];
        if (updated.length > 20) {
          updated.shift();
        }
        return updated;
      });
      nextMsgIndex = (nextMsgIndex + 1) % newMessages.length;
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex flex-col h-full overflow-hidden bg-[#111118]"
      style={{ borderLeft: 'none' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        <span className="font-medium text-white" style={{ fontSize: 13 }}>
          Live chat
        </span>
        <div className="flex items-center gap-1.5" style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
          <span className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-pulse" />
          <span>1,280 watching</span>
        </div>
      </div>


      {/* Messages List */}
      <div
        ref={chatContainerRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-3 gap-2 flex flex-col no-scrollbar"
      >
        {messages.map((msg) =>
          msg.isGift ? (
            <div
              key={msg.id}
              style={{
                background: 'rgba(240,180,41,0.08)',
                border: '0.5px solid rgba(240,180,41,0.2)',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '11px',
              }}
            >
              <span style={{ fontWeight: 500, color: '#F0B429' }}>{msg.user}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: '4px' }}>{msg.text}</span>
            </div>
          ) : (
            <div key={msg.id} className="flex min-w-0 flex-wrap gap-x-2 gap-y-1 items-start">
              <span
                className="font-semibold flex-shrink-0"
                style={{ fontSize: 11, color: msg.color }}
              >
                {msg.user}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.4,
                }}
              >
                {msg.text}
              </span>
            </div>
          )
        )}
      </div>

      {/* Input Row */}
      <div className="px-3 pb-3 flex-shrink-0">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <input
            type="text"
            aria-label="Live chat message" placeholder="Say something..."
            className="min-h-11 lg:min-h-0 flex-1 bg-transparent text-xs text-white placeholder:text-white/30 focus:outline-none min-w-0"
          />
          <button
            aria-label="Send a gift" onClick={openPicker}
            className="flex h-11 w-11 items-center justify-center text-yellow-400 hover:text-yellow-300 transition-colors flex-shrink-0 lg:h-auto lg:w-auto"
          >
            <HugeiconsIcon icon={GiftIcon} size={16} color="currentColor" strokeWidth={1.5} />
          </button>
          <button aria-label="Send chat message" className="flex h-11 w-11 items-center justify-center flex-shrink-0 text-white/40 hover:text-white transition-colors lg:h-auto lg:w-auto">
            <HugeiconsIcon icon={Sent02Icon} size={16} color="currentColor" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
