import { ChatBot } from '@/components/ai/ChatBot';
import { Footer } from '@/components/layout/Footer';
import { NavigationBar } from '@/components/layout/NavigationBar';
import { ChatProvider } from '@/components/providers/ChatProvider';
import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-1">
        <ChatProvider>
          {children}
          <ChatBot />
        </ChatProvider>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;