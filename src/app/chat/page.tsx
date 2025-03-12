"use client";
import { useState } from "react";
import { Message, MessageRole } from "../types";
import UserMessage from "../components/UserMessage";
import AiMessage from "../components/AiMessage";
import ChatInput from "../components/ChatInput";
import { parseStreamedResponse } from "../utils/parseStreamedResponse";

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (newMessage: string) => {
    if (!newMessage.trim() || isLoading) return;
    setIsLoading(true);

    // 先更新 UI，新增使用者訊息
    const updatedMessages: Message[] = [
      ...messages,
      { role: MessageRole.User, content: newMessage },
    ];
    setMessages(updatedMessages);

    // 加入一個 "assistant" 的 placeholder，讓 UI 顯示 AI 回應的 loading 狀態
    const aiPlaceholderMessage: Message = {
      role: MessageRole.Assistant,
      content: "Loading ...",
    };
    setMessages((prev) => [...prev, aiPlaceholderMessage]);

    try {
      const response = await fetch("http://localhost:3001/chat-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-key": "",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        let errorMessage = "🤖 AI 回應失敗，請稍後再試。";
        switch (response.status) {
          case 401:
          case 403:
            errorMessage = "🤖 未授權使用 chat bot，請聯絡管理員";
            break;
          default:
            break;
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
            role: MessageRole.Assistant,
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
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) =>
          msg.role === MessageRole.User ? (
            <UserMessage key={index} message={msg.content} />
          ) : (
            <AiMessage key={index} message={msg.content} />
          )
        )}
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatPage;
