export enum MessageRole {
  User = "user",
  Assistant = "assistant",
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
}
