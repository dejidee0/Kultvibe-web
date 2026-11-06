import React from 'react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Topbar from '@/components/layout/Topbar';
import MobileHeader from '@/components/layout/MobileHeader';
import MobileTabBar from '@/components/layout/MobileTabBar';
import AuthModal from '@/components/ui/AuthModal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh w-full bg-kv-base text-kv-text overflow-hidden">
      <div className="hidden lg:flex"><DashboardSidebar /></div>
      <div className="flex min-w-0 flex-col flex-1 overflow-hidden">
        <div className="hidden lg:block"><Topbar /></div>
        <MobileHeader />
        <main className="flex-1 min-h-0 min-w-0 overflow-y-auto bg-kv-surface p-4 pb-[calc(65px+env(safe-area-inset-bottom)+1rem)] lg:p-6">
          {children}
        </main>
        <MobileTabBar dashboard />
        <AuthModal />
      </div>
    </div>
  );
}
