import { useState, FormEvent } from 'react';

interface Props {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: Props) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4 animate-fade-in-up">
      <input
        type="text"
        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 glass focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all duration-200 shadow-sm"
        placeholder="Type your message..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="bg-primary text-white px-6 py-2 rounded-lg shadow-md hover:bg-accent hover:scale-105 active:scale-95 transition-all duration-200 font-semibold text-lg"
      >
        Send
      </button>
    </form>
  );
} 