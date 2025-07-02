export interface ChatMessage {
  id: string;
  sender: 'user' | 'psyci';
  content: string;
  timestamp: number;
  imageUrl?: string;
} 