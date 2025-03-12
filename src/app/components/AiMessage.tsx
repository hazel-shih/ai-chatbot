import React from "react";
import Image from "next/image";
import MarkdownRenderer from "./MarkdownRenderer";

interface AiMessageProperty {
  message: string;
  isLoading: boolean;
}

const AiMessage: React.FC<AiMessageProperty> = ({ message, isLoading }) => {
  return (
    <div className="w-full p-4">
      <div className="text-white p-3 rounded-lg">
        <MarkdownRenderer content={message} />
      </div>
      {!isLoading && (
        <div>
          <button
            className="pl-3 cursor-pointer"
            onClick={() => console.log("開啟畫布")}
          >
            <Image
              src="/canvas.png"
              width={24}
              height={24}
              alt="canvas-feature"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default AiMessage;
