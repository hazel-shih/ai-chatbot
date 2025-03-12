export const parseStreamedResponse = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onChunkReceived: (chunk: string) => void
) => {
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    chunk.split("\n\n").forEach((line) => {
      const trimmed = line.replace(/^data:\s*/, "").trim();
      if (!trimmed || trimmed === "[DONE]") return;

      try {
        // 解析 JSON
        const parsedData = JSON.parse(trimmed);
        const content = parsedData.choices?.[0]?.delta?.content || "";
        if (content) {
          onChunkReceived(content);
        }
      } catch (error) {
        console.error("JSON 解析錯誤:", error);
        if (trimmed !== "[DONE]") {
          onChunkReceived(trimmed);
        }
      }
    });
  }
};
