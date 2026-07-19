import { ReactNode } from "react";
import { CardVariant } from "@m2s2/models";
import "./BaseCard.scss";

interface BaseCardProps {
  children: ReactNode;
  featured?: boolean;
  variant?: CardVariant;
}

export function BaseCard({
  children,
  featured = false,
  variant = "default",
}: BaseCardProps) {
  return (
    <article
      className={`m2s2-card${featured ? " featured" : ""}`}
      data-variant={variant}
    >
      {children}
    </article>
  );
}
