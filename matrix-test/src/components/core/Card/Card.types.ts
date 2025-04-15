import { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the card should have a glow effect on hover
   * @default true
   */
  glowOnHover?: boolean;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}