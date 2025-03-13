import { encode } from "gpt-tokenizer";
import { Message } from "../types";

const SAFE_LIMIT = 120_000; // GPT-4o Mini 最大 token 限制為 128_000，設定安全範圍，避免 API 超載
const MAX_OUTPUT_TOKENS = 2000; // API 會輸出的最大 token 數量（已於後端限制）

/**
 * 修剪 `Message[]`，確保 token 數量不超過 SAFE_LIMIT
 */
export function trimMessagesToFit(messages: Message[]): Message[] {
  let totalTokens = 0;

  // 計算所有訊息的 token 數量
  const tokenizedMessages = messages.map((msg) => ({
    ...msg,
    tokenCount: encode(msg.content).length,
  }));

  // 計算目前的 token 總數
  totalTokens = tokenizedMessages.reduce((sum, msg) => sum + msg.tokenCount, 0);

  // 如果總 token 數量 + 輸出超過 SAFE_LIMIT，則裁剪最舊的訊息
  while (
    totalTokens + MAX_OUTPUT_TOKENS > SAFE_LIMIT &&
    tokenizedMessages.length > 1
  ) {
    const removedMsg = tokenizedMessages.shift(); // 移除最舊的訊息
    if (removedMsg) {
      totalTokens -= removedMsg.tokenCount;
    }
  }

  // 移除 tokenCount 欄位，返回裁剪後的訊息
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return tokenizedMessages.map(({ tokenCount, ...msg }) => msg);
}
