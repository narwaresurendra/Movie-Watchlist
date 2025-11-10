import { Navbar } from './Navbar';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};
