import { ReactNode } from "react";
import { Card as GenericCard } from "@mintlify/components";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import Link from "next/link";
import { config } from '@/config';

export function Card({ title, icon, color, href, children }: { title?: string, icon?: ReactNode | IconDefinition, color?: string, href?: string, children: React.ReactNode }) {
  const card =
    <GenericCard
      title={title}
      icon={icon}
      iconColor={color || config.colors?.primary}
      hoverHighlightColour={href ? color || config.colors?.primary : undefined}>
    {children}
  </GenericCard>

  if (href) {
    return <Link href={href}><div>{card}</div></Link>
  }

  return card;
}