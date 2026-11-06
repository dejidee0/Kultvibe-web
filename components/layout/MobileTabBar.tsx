'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { BellIcon, Home01Icon, Money01Icon, Wallet01Icon } from '@hugeicons/core-free-icons';
import { topNavItems, type NavItem } from './sidebarData';

const publicExtras: NavItem[] = [...topNavItems.slice(4), { label: 'Leaderboards', href: '/leaderboards', icon: Money01Icon }];
const dashboardItems: NavItem[] = [
  { ...topNavItems[0], href: '/dashboard' },
  { ...topNavItems[2], href: '/dashboard/tournaments' },
  { ...topNavItems[3], href: '/dashboard/stream' },
  { label: 'Wallet', href: '/dashboard/wallet', icon: Wallet01Icon },
];
const dashboardExtras: NavItem[] = [
  { label: 'Settings', href: '/dashboard/settings', icon: Home01Icon },
  { label: 'Notifications', href: '/dashboard/notifications', icon: BellIcon },
];

export default function MobileTabBar({ dashboard = false }: { dashboard?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const items = dashboard ? dashboardItems : topNavItems.slice(0, 4);
  const extras = dashboard ? dashboardExtras : publicExtras;
  const isActive = (href: string) => pathname === href || (href !== '/' && href !== '/dashboard' && pathname.startsWith(href));
  const moreActive = extras.some(item => isActive(item.href));
  const close = () => { setOpen(false); trigger.current?.focus(); };
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { if (open) panel.current?.querySelector<HTMLElement>('button, a')?.focus(); }, [open]);
  return (
    <div className="lg:hidden">
      <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] bg-kv-surface pb-[env(safe-area-inset-bottom)]">
        <div className="grid h-16 grid-cols-5 items-center px-1">
          {items.map(({ label, href, icon }) => (
            <Link key={href} href={href} aria-current={isActive(href) ? 'page' : undefined} className={'flex min-h-11 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-[10px] ' + (isActive(href) ? 'bg-[rgba(240,180,41,0.12)] text-kv-gold' : 'text-white/40 hover:bg-white/[0.07] hover:text-white')}>
              <HugeiconsIcon icon={icon} size={20} color="currentColor" strokeWidth={1.5} /><span className="max-w-full truncate">{label}</span>
            </Link>
          ))}
          <button ref={trigger} type="button" aria-expanded={open} aria-controls="mobile-more" onClick={() => setOpen(value => !value)} className={'flex min-h-11 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-[10px] ' + (open || moreActive ? 'bg-[rgba(240,180,41,0.12)] text-kv-gold' : 'text-white/40 hover:bg-white/[0.07] hover:text-white')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></svg><span>More</span>
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <>
            <motion.button type="button" aria-label="Close navigation menu" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.15 }} className="fixed inset-0 z-40 bg-black/70" />
            <motion.div id="mobile-more" ref={panel} role="dialog" aria-modal="true" aria-label="More navigation" initial={{ y: reduceMotion ? 0 : 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reduceMotion ? 0 : 24, opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} className="fixed inset-x-0 bottom-[calc(65px+env(safe-area-inset-bottom))] z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-t-2xl border border-white/10 bg-kv-surface p-4" onKeyDown={event => {
              if (event.key === 'Escape') { event.preventDefault(); close(); }
              if (event.key === 'Tab') {
                const controls = panel.current?.querySelectorAll<HTMLElement>('button, a');
                if (!controls?.length) return;
                const first = controls[0], last = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
                else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
              }
            }}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">More</span>
                <button type="button" aria-label="Close menu" onClick={close} className="flex h-11 w-11 items-center justify-center rounded-lg text-white/40 hover:bg-white/[0.07]">
                  <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
                </button>
              </div>
              {extras.map(({ label, href, icon }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={isActive(href) ? 'page' : undefined} className={'flex min-h-11 items-center gap-3 rounded-lg px-3 py-3 text-sm ' + (isActive(href) ? 'bg-[rgba(240,180,41,0.12)] text-kv-gold' : 'text-white/40 hover:bg-white/[0.07] hover:text-white')}>
                  <HugeiconsIcon icon={icon} size={20} color="currentColor" strokeWidth={1.5} />{label}
                </Link>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
