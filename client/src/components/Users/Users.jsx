import { useEffect, useState } from "react";
import UserCard from "../UserCard/UserCard";
import Preloader from "../Preloader/Preloader";
import styles from "./Users.module.css";
import { formatPhone } from "../../utils/formatPhone";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function Users({ refreshSignal }) {
  const [apiUsers, setApiUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async (reset = false) => {
    setLoading(true);
    setError(null);
    try {
      const pageToFetch = reset ? 1 : page + 1;

      const res = await fetch(
        `${API_BASE_URL}/api/users?page=${pageToFetch}&count=6`
      );
      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();

      if (data.success) {
        const fetchedUsers = data.users.map((user) => ({
          id: user.id,
          name: user.name,
          avatar: user.photo,
          details: `${user.position || "Unknown"}<br />${
            user.email
          }<br />${formatPhone(user.phone)}`,
          registration_timestamp: user.registration_timestamp * 1000,
        }));

        if (reset) {
          setApiUsers(fetchedUsers);
          setPage(1);
        } else {
          setApiUsers((prev) => [...prev, ...fetchedUsers]);
          setPage(pageToFetch);
        }

        setTotalPages(data.total_pages);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(true);
  }, []);

  useEffect(() => {
    if (refreshSignal) {
      fetchUsers(true);
    }
  }, [refreshSignal]);

  const showMoreVisible = page < totalPages && apiUsers.length < 47;

  return (
    <section id="users" className={styles["users-section"]}>
      <h2 className={styles["section-title"]}>Working with GET request</h2>

      {error && <p className={styles.error}>Error: {error}</p>}

      <div className={styles["user-cards"]}>
        {apiUsers.map((user) => (
          <UserCard key={user.id} {...user} />
        ))}
      </div>

      {loading && (
        <div className={styles["preloader-wrapper"]}>
          <Preloader type="normal" />
        </div>
      )}

      {showMoreVisible && !loading && (
        <button
          className={styles["show-more-button"]}
          onClick={() => fetchUsers(false)}
        >
          Show more
        </button>
      )}
    </section>
  );
}

export default Users;
