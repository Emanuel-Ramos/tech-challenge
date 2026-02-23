import type { CardProps } from "@shipay/types";
import styles from "./Card.module.css";

/**
 * Card component for content containers.
 */
export function Card({ children, title, className }: CardProps) {
  const classNames = [styles.card, className].filter(Boolean).join(" ");

  return (
    <div className={classNames}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
