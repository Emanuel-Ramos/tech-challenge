import styles from "./Hero.module.scss";

interface HeroProps {
  title?: string;
  subtitle?: string;
}

export function Hero({
  title = "Welcome",
  subtitle = "Your payment management solution",
}: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles["hero__container"]}>
        <h1 className={styles["hero__title"]}>{title}</h1>
        <p className={styles["hero__subtitle"]}>{subtitle}</p>
      </div>
    </section>
  );
}
