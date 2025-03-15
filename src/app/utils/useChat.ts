import { useState, useRef, useCallback } from "react";
import { nanoid } from "nanoid";
import { Message, MessageRole } from "../types";
import { parseStreamedResponse } from "../utils/parseStreamedResponse";
import useQueryParam from "../utils/useQueryParam";
import { trimMessagesToFit } from "../utils/trimMessagesToFit";

const ERROR_MESSAGES = {
  DEFAULT: "🤖 AI 回應失敗，請稍後再試。",
  UNAUTHORIZED: "🤖 未授權使用 chat bot，請聯絡管理員",
  NO_RESPONSE: "🤖 伺服器沒有回應內容。",
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const userKey = useQueryParam("userKey");
  const lastUserMessageRef = useRef<HTMLDivElement | null>(null);

  const addUserMessage = (newMessage: string) => {
    const userMessageId = nanoid();
    const userMessage: Message = {
      id: userMessageId,
      role: MessageRole.User,
      content: newMessage,
    };

    const aiPlaceholder: Message = {
      id: nanoid(),
      role: MessageRole.Assistant,
      content: "Loading ...",
    };

    setMessages((prev) => [...prev, userMessage, aiPlaceholder]);

    // 使用 requestAnimationFrame 來確保在下一幀渲染後滾動
    requestAnimationFrame(() => {
      lastUserMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const updateLastAIMessage = useCallback((content: string) => {
    setMessages((prev) =>
      prev.map((msg, index) =>
        index === prev.length - 1 ? { ...msg, content } : msg
      )
    );
  }, []);

  const fetchAiResponse = async (trimmedMessages: Message[]) => {
    try {
      const response = await fetch(
        "https://ai-chatbot-server-tj16.onrender.com/chat-stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "user-key": userKey ?? "",
          },
          body: JSON.stringify({
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            messages: trimmedMessages.map(({ id, ...msg }) => msg),
          }),
        }
      );

      if (!response.ok) {
        const errorMessage =
          response.status === 401 || response.status === 403
            ? ERROR_MESSAGES.UNAUTHORIZED
            : ERROR_MESSAGES.DEFAULT;
        throw new Error(errorMessage);
      }

      if (!response.body) throw new Error(ERROR_MESSAGES.NO_RESPONSE);

      const reader = response.body.getReader();
      let accumulatedResponse = "";
      await parseStreamedResponse(reader, (chunk) => {
        accumulatedResponse += chunk;
        updateLastAIMessage(accumulatedResponse);
      });
    } catch (error) {
      let errorMessage = ERROR_MESSAGES.DEFAULT;
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      updateLastAIMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (newMessage: string) => {
    if (!newMessage.trim() || isLoading) return;
    setIsLoading(true);
    addUserMessage(newMessage);
    const trimmedMessages = trimMessagesToFit([
      ...messages,
      { id: nanoid(), role: MessageRole.User, content: newMessage },
    ]);
    fetchAiResponse(trimmedMessages);
  };

  return {
    messages,
    isLoading,
    handleSendMessage,
    lastUserMessageRef,
  };
};

export default useChat;
