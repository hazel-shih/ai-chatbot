"use client";
import { useState, useRef } from "react";
import Image from "next/image";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState("");
  const isComposing = useRef(false); // 使用 ref 來追蹤組字狀態避免一按 enter 就送出文字

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="sticky bottom-0 w-full px-4 pb-4 pt-0">
      <div className="flex items-center bg-neutral-700 rounded-xl p-2">
        <input
          type="text"
          placeholder="輸入訊息..."
          className="flex-grow p-3 rounded-lg bg-neutral-700 text-white outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onCompositionStart={() => (isComposing.current = true)}
          onCompositionEnd={() => (isComposing.current = false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isComposing.current) {
              handleSend();
            }
          }}
        />
        <button
          className="ml-2 p-3 bg-white text-neutral-700 rounded-full cursor-pointer hover:bg-neutral-300"
          onClick={handleSend}
        >
          <Image src="/up-arrow.png" width={16} height={16} alt="up-arrow" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
