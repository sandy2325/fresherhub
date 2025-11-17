import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { User } from '@/types';

interface LayoutProps {
  children: ReactNode;
  user?: User | null;
  onSearch?: (query: string) => void;
  showFooter?: boolean;
}

const Layout = ({ children, user, onSearch, showFooter = true }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onSearch={onSearch} />
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;