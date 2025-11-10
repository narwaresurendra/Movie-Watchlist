import { Navbar } from './Navbar';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none"></div>
        <div className="relative z-10">{children}</div>
      </main>
    </div>
  );
};
