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
        {lines.map((line, idx) => (
          <p key={idx}>{line.trim()}</p>
        ))}
      </div>
    </article>
  );
}

export default UserCard;
