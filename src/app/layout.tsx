import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Psyci Buddy',
  description: 'Your friendly psychiatrist/companion chatbot',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
} 