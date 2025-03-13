"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { encode } from "gpt-tokenizer";

const MAX_INPUT_TOKENS = 4096;

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const isComposing = useRef(false); // 追蹤組字狀態，避免組字時按 Enter 送出

  const validateUserInput = (input: string) => {
    const inputTokens = encode(input).length;
    if (inputTokens > MAX_INPUT_TOKENS) {
      setError(`輸入過長！最多允許 ${MAX_INPUT_TOKENS} tokens，請精簡你的輸入`);
      return false;
    }
    setError("");
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setInput(newText);
    validateUserInput(newText); // 及時驗證輸入長度
  };

  const handleSend = () => {
    if (input.trim() && !error) {
      onSendMessage(input);
      setInput("");
      setError("");
    }
  };

  return (
    <div className="sticky bottom-0 w-full px-4 pb-4 pt-0">
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <div
        className={`flex items-center bg-neutral-700 rounded-xl p-2 ${
          error ? "border-2 border-red-500" : ""
        }`}
      >
        <input
          disabled={isLoading}
          type="text"
          placeholder={
            isLoading
              ? "ChatGPT 正在努力回答你的問題，請等它一下"
              : "詢問任何問題"
          }
          className={`flex-grow p-3 rounded-lg bg-neutral-700 text-white outline-none`}
          value={input}
          onChange={handleInputChange}
          onCompositionStart={() => (isComposing.current = true)}
          onCompositionEnd={() => (isComposing.current = false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isComposing.current && !error) {
              handleSend();
            }
          }}
        />
        <button
          className="ml-2 p-3 bg-white text-neutral-700 rounded-full cursor-pointer hover:bg-neutral-300 
             disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:hover:bg-neutral-200"
          onClick={handleSend}
          disabled={isLoading || Boolean(error)}
        >
          <Image src="/up-arrow.png" width={16} height={16} alt="up-arrow" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
