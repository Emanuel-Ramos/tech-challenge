import styles from "./Hero.module.css";

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
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </section>
  );
}
