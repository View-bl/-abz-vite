import styles from "./UserCard.module.css";

function UserCard({ avatar, name, details }) {
  const lines = details.split(/<br\s*\/?>/);

  return (
    <article className={styles["user-card"]}>
      <img
        className={styles["user-avatar"]}
        src={avatar}
        alt={`Avatar of ${name}`}
      />
      <h3 className={styles["user-name"]}>{name}</h3>
      <div className={styles["user-details"]}>
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

          return (
            <p key={idx}>
              {isEmail ? (
                <span className={styles.email}>{trimmed}</span>
              ) : (
                trimmed
              )}
            </p>
          );
        })}
      </div>
    </article>
  );
}

export default UserCard;
