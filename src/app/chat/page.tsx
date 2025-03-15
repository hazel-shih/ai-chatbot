"use client";
import { useState, useRef } from "react";
import { nanoid } from "nanoid";
import { Message, MessageRole } from "../types";
import ChatInput from "../components/ChatInput";
import { trimMessagesToFit } from "../utils/trimMessagesToFit";
import ChatMessages from "../components/ChatMessages";
import { parseStreamedResponse } from "../utils/parseStreamedResponse";
import useQueryParam from "../utils/useQueryParam";

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const userKey = useQueryParam("userKey");

  // 滾動到最後一則 UserMessage
  const lastUserMessageRef = useRef<HTMLDivElement | null>(null);
  const scrollToLatestUserMessage = () => {
    if (lastUserMessageRef.current) {
      lastUserMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSendMessage = async (newMessage: string) => {
    if (!newMessage.trim() || isLoading) return;
    setIsLoading(true);

    // 先更新 UI，新增使用者訊息（附帶 id）
    const userMessage: Message = {
      id: nanoid(),
      role: MessageRole.User,
      content: newMessage,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // 立即滾動到新加入的使用者訊息
    setTimeout(scrollToLatestUserMessage, 0);

    // 加入 AI 回應的 placeholder
    const aiPlaceholderMessage: Message = {
      id: nanoid(),
      role: MessageRole.Assistant,
      content: "Loading ...",
    };
    setMessages((prev) => [...prev, aiPlaceholderMessage]);

    const trimmedMessages = trimMessagesToFit(updatedMessages); // 裁剪對話確保不超過 SAFE_LIMIT tokens

    try {
      const response = await fetch(
        "https://ai-chatbot-server-tj16.onrender.com/chat-stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "user-key": userKey ? userKey : "",
          },
          body: JSON.stringify({
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            messages: trimmedMessages.map(({ id, ...msg }) => msg),
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = "🤖 AI 回應失敗，請稍後再試。";
        if (response.status === 401 || response.status === 403) {
          errorMessage = "🤖 未授權使用 chat bot，請聯絡管理員";
        }
        throw new Error(errorMessage);
      }

      if (!response.body) throw new Error("🤖 伺服器沒有回應內容。");

      let assistantMessage = "";
      const reader = response.body.getReader();

      // 使用 `parseStreamedResponse` 逐步更新 UI
      await parseStreamedResponse(reader, (chunk) => {
        assistantMessage += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: assistantMessage,
          };
          return updated;
        });
      });
    } catch (error) {
      let errorMessage = "🤖 AI 回應失敗，請稍後再試。";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setMessages((prev) => [
        ...prev.slice(0, -1), // 刪除 placeholder
        {
          id: nanoid(),
          role: MessageRole.Assistant,
          content: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-neutral-900 flex flex-col">
      <ChatMessages
        messages={messages}
        lastUserMessageRef={lastUserMessageRef}
        isLoading={isLoading}
      />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatPage;
