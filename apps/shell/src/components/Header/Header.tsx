import Image from "next/image";
import styles from "./Header.module.css";

interface HeaderProps {
  logo: string;
  tenantName: string;
  showLogo?: boolean;
}

export function Header({ logo, tenantName, showLogo = true }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          {showLogo && (
            <Image
              src={logo}
              alt={`${tenantName} logo`}
              width={120}
              height={32}
              className={styles.logo}
              priority
            />
          )}
          <span className={styles.name}>{tenantName}</span>
        </div>
        <nav className={styles.nav}>
          <a href="#dashboard" className={styles.navLink}>
            Dashboard
          </a>
          <a href="#payments" className={styles.navLink}>
            Payments
          </a>
        </nav>
      </div>
    </header>
  );
}
