
import PreviewBadge from '@/components/ui/PreviewBadge'
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import type { IconSvgElement } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

type Props = {
  title: string;
  icon?: IconSvgElement;
  iconColor?: string;
  badge?: string;
  cta?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
};

export default function SectionHeader({
  title,
  icon,
  iconColor = '#F0B429',
  badge,
  cta = 'View all',
  ctaHref,
  onCtaClick,
}: Props) {
  const ctaContent = (
    <>
      {cta}
      <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="currentColor" strokeWidth={1.5} />
    </>
  );

  return (
    <div className="flex min-w-0 items-center justify-between max-lg:flex-wrap max-lg:gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <PreviewBadge uppercase={badge === 'PREVIEW'} />
        {icon && <HugeiconsIcon icon={icon} size={18} color={iconColor} strokeWidth={1.5} />}
        <h2 className="text-[15px] font-semibold text-white max-lg:truncate">{title}</h2>
      </div>
      {cta && (
        ctaHref ? (
          <Link
            href={ctaHref}
            className="flex shrink-0 items-center gap-1 text-xs font-medium transition-colors hover:text-white"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            {ctaContent}
          </Link>
        ) : (
          <button
            onClick={onCtaClick}
            className="flex shrink-0 items-center gap-1 text-xs font-medium transition-colors hover:text-white"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            {ctaContent}
          </button>
        )
      )}
    </div>
  );
}
