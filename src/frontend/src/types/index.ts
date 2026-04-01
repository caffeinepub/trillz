export interface User {
  principal: string;
  displayName: string;
  createdAt: string;
  language?: string;
}

export interface Trip {
  id: string;
  name: string;
  from: string;
  to: string;
  destinationId: string;
  status: "Planning" | "Arrived";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderDisplay: string;
  message: string;
  timestamp: string;
}

export type AppView =
  | "splash"
  | "languageSelect"
  | "dashboard"
  | "tripPlanner"
  | "destinationDetail"
  | "groupChat"
  | "atDestination"
  | "profile"
  | "explore";
