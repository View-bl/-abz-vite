import styles from "./Header.module.css";
import logo from "../../assets/images/logo.svg";
function Header() {
  return (
    <header className={styles.menu}>
      <div className={styles.con}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <nav className={styles.navigation}>
          <a href="#users" className={styles.button}>
            Users
            
          </a>
          <a href="#signup" className={styles.button}>
            <span className={styles["button-text"]}>Sign up</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
