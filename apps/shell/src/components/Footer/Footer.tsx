import styles from "./Footer.module.css";

interface FooterProps {
  copyright?: string;
}

export function Footer({
  copyright = "2024 Shipay. All rights reserved.",
}: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>{copyright}</p>
      </div>
    </footer>
  );
}
