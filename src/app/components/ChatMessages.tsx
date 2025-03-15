import React from "react";
import { Message, MessageRole } from "../types";
import UserMessage from "./UserMessage";
import AiMessage from "./AiMessage";

interface ChatMessagesProps {
  messages: Message[];
  lastUserMessageRef: React.RefObject<HTMLDivElement | null>;
  isLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  lastUserMessageRef,
  isLoading,
}) => {
  const userMessages = messages.filter((msg) => msg.role === MessageRole.User);
  const lastUserMessage = userMessages[userMessages.length - 1];

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg) =>
        msg.role === MessageRole.User ? (
          <UserMessage
            key={msg.id}
            message={msg.content}
            ref={msg.id === lastUserMessage.id ? lastUserMessageRef : null}
          />
        ) : (
          <AiMessage key={msg.id} message={msg.content} isLoading={isLoading} />
        )
      )}
    </div>
  );
};

export default ChatMessages;
