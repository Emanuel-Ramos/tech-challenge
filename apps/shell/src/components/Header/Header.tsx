import Image from "next/image";
import styles from "./Header.module.scss";

interface HeaderProps {
  logo: string;
  tenantName: string;
  showLogo?: boolean;
}

export function Header({ logo, tenantName, showLogo = true }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles["header__container"]}>
        <div className={styles["header__brand"]}>
          {showLogo && (
            <Image
              src={logo}
              alt={`${tenantName} logo`}
              width={120}
              height={32}
              className={styles["header__logo"]}
              priority
            />
          )}
          <span className={styles["header__name"]}>{tenantName}</span>
        </div>
        <nav className={styles["header__nav"]}>
          <a href="#dashboard" className={styles["header__nav-link"]}>
            Dashboard
          </a>
          <a href="#payments" className={styles["header__nav-link"]}>
            Payments
          </a>
        </nav>
      </div>
    </header>
  );
}
