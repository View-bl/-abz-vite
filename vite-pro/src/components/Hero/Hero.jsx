import styles from "./Hero.module.css";

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles["hero-content"]}>
        <h1 className={styles["hero-title"]}>
          Test assignment for front-end developer
        </h1>
        <p className={styles["hero-description"]}>
          What defines a good front-end developer is one that has skilled
          knowledge of HTML, CSS, JS with a vast understanding of User design
          thinking as they'll be building web interfaces with accessibility in
          mind. They should also be excited to learn, as the world of Front-End
          Development keeps evolving.
        </p>
        <a href="#signup" className={styles["button"]}>
          Sign up
        </a>
      </div>
    </section>
  );
}

export default Hero;
