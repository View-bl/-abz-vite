import UserCard from "../UserCard/UserCard";
import Preloader from "../Preloader/Preloader";
import styles from "./Users.module.css";
import { formatPhone } from "../../utils/formatPhone";

function Users({ users, loading, error, fetchMore, page, totalPages }) {
  const showMoreVisible = page < totalPages && users.length < 47;

  return (
    <section id="users" className={styles["users-section"]}>
      <h2 className={styles["section-title"]}>Working with GET request</h2>

      {error && <p className={styles.error}>Error: {error}</p>}

      <div className={styles["user-cards"]}>
        {users.map((user) => (
          <UserCard
            key={user.id}
            {...user}
            details={user.details.split("<br />").map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}
            phone={formatPhone(user.phone)}
          />
        ))}
      </div>

      {loading && (
        <div className={styles["preloader-wrapper"]}>
          <Preloader type="normal" />
        </div>
      )}

      {showMoreVisible && !loading && (
        <button className={styles["show-more-button"]} onClick={fetchMore}>
          Show more
        </button>
      )}
    </section>
  );
}

export default Users;
