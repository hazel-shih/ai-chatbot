export enum MessageRole {
  User = "user",
  Assistant = "assistant",
}

export interface Message {
  role: MessageRole;
  content: string;
}
