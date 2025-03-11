import UserMessage from "../components/UserMessage";
import AiMessage from "../components/AiMessage";
import ChatInput from "../components/ChatInput";

const ChatPage = () => (
  <div className="w-full h-screen bg-neutral-900 flex flex-col">
    <div className="flex-1 overflow-y-auto p-4">
      {Array.from({ length: 10 }, (_, i) => (
        <UserMessage
          key={i}
          message="🛠 安裝 ShadCN 執行以下指令來初始化 ShadCN：
          npx shadcn-ui@latest init
          過程中，ShadCN 會詢問你一些設定，建議選擇：
          框架：Next.js
          CSS 框架：Tailwind
          元件路徑：@/components/ui（這樣會對應到 components/ui/）

          然後你可以安裝 button 和 input：
          npx shadcn-ui@latest add button input

          這樣 ShadCN 會幫你在 components/ui/ 內建立 button.tsx"
        />
      ))}
      <AiMessage message="目前針對大型語言模型（LLM）運算，有幾個專門的硬體平台和軟體技術可以選擇。這些平台不僅擁有高效能的計算能力，還提供免費的 API 金鑰，非常適合個人使用，特別是在小型專案或原型開發中可能遇到的各種限制，例如每分鐘的請求次數、每日總額度或 token 量等。以下是幾個適合使用於個人專案的完全免費的 LLM 平台：" />
    </div>
    <ChatInput />
  </div>
);

export default ChatPage;
