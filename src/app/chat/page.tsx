"use client";
import ChatInput from "../components/ChatInput";
import ChatMessages from "../components/ChatMessages";
import useChat from "../utils/useChat";

const ChatPage: React.FC = () => {
  const { messages, isLoading, handleSendMessage, lastUserMessageRef } =
    useChat();

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
