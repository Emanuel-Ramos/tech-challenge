import type { CardProps } from "@shipay/types";
import styles from "./Card.module.scss";

export function Card({ children, title, className }: CardProps) {
  const classNames = [styles.card, className].filter(Boolean).join(" ");

  return (
    <div className={classNames}>
      {title && <h3 className={styles["card__title"]}>{title}</h3>}
      <div className={styles["card__content"]}>{children}</div>
    </div>
  );
}
