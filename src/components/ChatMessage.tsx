import { ChatMessage as ChatMessageType } from '../types';

interface Props {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-bold text-white shadow-md border border-background">
          P
        </div>
      )}
      <div
        className={`px-4 py-2 max-w-xs shadow-chat transition-all duration-300 animate-pop-in ${
          isUser
            ? 'bg-primary text-white rounded-br-2xl rounded-tl-2xl rounded-bl-2xl'
            : 'glass text-gray-900 rounded-bl-2xl rounded-tr-2xl rounded-br-2xl border border-background'
        }`}
      >
        {message.content}
        {message.imageUrl && (
          <img src={message.imageUrl} alt="attachment" className="mt-2 rounded" />
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-white shadow-md border border-background">
          U
        </div>
      )}
    </div>
  );
} 