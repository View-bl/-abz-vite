import styles from "./UserCard.module.css";

function UserCard({ avatar, name, details }) {
  const lines = details.split(/<br\s*\/?>/);
  const position = lines[0]?.trim() || "";
  const email = lines[1]?.trim() || "";
  const phone = lines[2]?.trim() || "";

  return (
    <article className={styles["user-card"]}>
      <img
        className={styles["user-avatar"]}
        src={avatar}
        alt={`Avatar of ${name}`}
      />
      <h3 className={styles["user-name"]}>{name}</h3>
      <div className={styles["user-details"]}>
        <p>{position}</p>
        <p>
          <a
            href={`mailto:${email}`}
            className={styles["user-email"]}
            title={email} 
          >
            {email}
          </a>
        </p>
        <p>{phone}</p>
      </div>
    </article>
  );
}

export default UserCard;
