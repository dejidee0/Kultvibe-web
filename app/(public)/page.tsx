import { brand } from '@/lib/brand'
import type { Metadata } from 'next'
import React from 'react';
import { Award01Icon } from '@hugeicons/core-free-icons';

export const metadata: Metadata = {
  title: brand.siteTitle,
  description: brand.siteDescription,
}
import SectionHeader from '@/components/ui/SectionHeader';
import FeaturedStream from '@/components/stream/FeaturedStream';
import StreamGrid from '@/components/stream/StreamGrid';
import TournamentList from '@/components/tournament/TournamentList';
import LeaderboardStrip from '@/components/leaderboard/LeaderboardStrip';
import StatsBar from '@/components/ui/StatsBar';
import CreatorsGrid from '@/components/stream/CreatorsGrid';
import UpcomingStrip from '@/components/tournament/UpcomingStrip';

export default function Homepage() {
  return (
    <div
      className="flex min-w-0 flex-col p-4 gap-6 lg:p-6 lg:gap-8"
      style={{ background: '#08080D', minHeight: '100%' }}
    >
      <FeaturedStream />

      <section className="flex flex-col gap-3">
        <SectionHeader badge="LIVE" title="More streams" cta="View all" ctaHref="/streams" />
        <StreamGrid />
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader icon={Award01Icon} title="Open tournaments" cta="All tournaments" ctaHref="/compete" />
        <TournamentList />
      </section>

      <section>
        <LeaderboardStrip />
      </section>

      <StatsBar />

      <CreatorsGrid />

      <UpcomingStrip />
    </div>
  );
}
