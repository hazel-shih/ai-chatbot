import Image from "next/image";

const ChatInput: React.FC = () => {
  return (
    <div className="sticky bottom-0 w-full px-4 pb-4 pt-0">
      <div className="flex items-center bg-neutral-700 rounded-xl p-2">
        <input
          type="text"
          placeholder="輸入訊息..."
          className="flex-grow p-3 rounded-lg bg-neutral-700 text-white outline-none"
        />
        <button className="ml-2 p-2 bg-white text-neutral-700 rounded-full cursor-pointer hover:bg-neutral-300">
          <Image src="/up-arrow.png" alt="up-arrow" width={20} height={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
