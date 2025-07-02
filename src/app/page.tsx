import ChatInterface from '../components/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated SVG blob background */}
      <svg className="absolute -top-32 -left-32 w-[600px] h-[600px] opacity-30 animate-blob-move z-0" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_f_1_2)">
          <ellipse cx="300" cy="300" rx="220" ry="180" fill="url(#paint0_linear_1_2)"/>
        </g>
        <defs>
          <filter id="filter0_f_1_2" x="0" y="0" width="600" height="600" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation="40"/>
          </filter>
          <linearGradient id="paint0_linear_1_2" x1="80" y1="80" x2="520" y2="520" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563eb"/>
            <stop offset="1" stopColor="#64748b"/>
          </linearGradient>
        </defs>
      </svg>
      <section className="w-full max-w-2xl text-center py-10 sm:py-14 md:py-16 animate-fade-in-up z-10">
        <div className="glass p-4 sm:p-8 md:p-10 shadow-2xl animate-card-float relative">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary mb-4 drop-shadow-lg animate-fade-in delay-100">
            Welcome to <span className="text-accent">Psyci Buddy</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 md:mb-10 animate-fade-in-up delay-300">
            Your friendly AI psychiatrist and companion.<br />
            Talk about your day, share your thoughts, or just have a chat.<br />
            <span className="text-primary font-semibold">Psyci Buddy</span> is here to listen and support you.
          </p>
        </div>
      </section>
      {/* Floating avatar above chat box */}
      <div className="relative w-full max-w-2xl flex justify-center z-20">
        <div className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 bg-primary w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-xl border-4 border-white animate-avatar-float">
          <span className="text-white text-2xl sm:text-3xl font-bold">P</span>
        </div>
      </div>
      <section className="w-full max-w-2xl animate-fade-in-up delay-500 z-10 px-2 sm:px-4 md:px-0">
        <ChatInterface />
      </section>
    </main>
  );
} 