import styles from "./UserCard.module.css";

function UserCard({ avatar, name, details }) {
  return (
    <article className={styles["user-card"]}>
      <img className={styles["user-avatar"]} src={avatar} alt="User Avatar" />
      <h3 className={styles["user-name"]}>{name}</h3>
      <p
        className={styles["user-details"]}
        dangerouslySetInnerHTML={{ __html: details }}
      />
    </article>
  );
}

export default UserCard;
