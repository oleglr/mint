import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Card as GenericCard } from '@mintlify/components';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

import { config } from '@/config';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

export function Card({
  title,
  icon,
  color,
  href,
  children,
}: {
  title?: string;
  icon?: ReactNode | IconDefinition;
  color?: string;
  href?: string;
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>();
  useIsomorphicLayoutEffect(() => {
    if (window.document.querySelector('html.dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const activeConfigColor = isDarkMode ? config.colors?.light : config.colors?.primary;

  const card = (
    <GenericCard
      title={title}
      icon={icon}
      iconColor={color || activeConfigColor}
      hoverHighlightColour={href ? color || activeConfigColor : undefined}
    >
      {children}
    </GenericCard>
  );

  if (href) {
    return (
      <Link href={href}>
        <div>{card}</div>
      </Link>
    );
  }

  return card;
}
