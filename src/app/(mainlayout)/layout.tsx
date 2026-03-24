import { Footer } from '@/components/layout/Footer';
import { NavigationBar } from '@/components/layout/NavigationBar';
import HomeBackground from '@/components/home/HomeBackground';
import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <HomeBackground>
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <main className="flex-1 bg-transparent">
          {children}
        </main>
        <Footer />
      </div>
    </HomeBackground>
  );
};

export default MainLayout;