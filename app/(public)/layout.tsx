import PreviewNotice from '@/components/ui/PreviewNotice'
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import AuthModal from '@/components/ui/AuthModal';
import MobileHeader from '@/components/layout/MobileHeader';
import MobileTabBar from '@/components/layout/MobileTabBar';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-dvh w-full overflow-hidden bg-kv-base">
        <Sidebar />
        <div className="flex min-w-0 flex-col flex-1 overflow-hidden">
          <div className="hidden lg:block"><Topbar /></div>
          <MobileHeader />
          <main className="flex-1 min-h-0 min-w-0 overflow-y-auto flex flex-col h-full pb-[calc(65px+env(safe-area-inset-bottom))] lg:pb-0">
            <PreviewNotice />
            <div className="min-h-0 min-w-0 flex-1">{children}</div>
          </main>
        </div>
      </div>
      <MobileTabBar />
      <AuthModal />
    </>
  );
}
