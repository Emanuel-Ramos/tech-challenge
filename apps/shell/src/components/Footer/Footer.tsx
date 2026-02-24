import styles from "./Footer.module.scss";

interface FooterProps {
  copyright?: string;
}

export function Footer({
  copyright = `${new Date().getFullYear()} Shipay. All rights reserved.`,
}: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles["footer__container"]}>
        <p className={styles["footer__copyright"]}>{copyright}</p>
      </div>
    </footer>
  );
}
