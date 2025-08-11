import { useEffect, useState } from "react";
import UserCard from "../UserCard/UserCard";
import Preloader from "../Preloader/Preloader";
import styles from "./Users.module.css";
import { formatPhone } from "../../utils/formatPhone";

const positionNames = {
  1: "Frontend Developer",
  2: "Backend Developer",
  3: "Designer",
  4: "QA",
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function Users({ refreshSignal }) {
  const [apiUsers, setApiUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mapUsers = (users) =>
    users.map((user) => ({
      id: user.id,
      name: user.name,
      avatar: user.photo,
      details: `${positionNames[user.position_id] || "Unknown"}<br />${
        user.email
      }<br />${formatPhone(user.phone)}`,
      registration_timestamp:
        new Date(user.registration_timestamp).getTime() || 0,
    }));

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
        const fetchedUsers = mapUsers(data.users);

        if (reset) {
          setApiUsers(
            fetchedUsers.sort(
              (a, b) => b.registration_timestamp - a.registration_timestamp
            )
          );
          setPage(1);
        } else {
          setApiUsers((prev) =>
            [...prev, ...fetchedUsers].sort(
              (a, b) => b.registration_timestamp - a.registration_timestamp
            )
          );
          setPage((prev) => prev + 1);
        }

        setTotalPages(data.total_pages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Запит лише останнього користувача
  const fetchLatestUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users?page=1&count=1`);
      if (!res.ok) throw new Error("Failed to fetch latest user");

      const data = await res.json();
      if (data.success && data.users.length > 0) {
        const latestUser = mapUsers(data.users)[0];

        setApiUsers((prev) => {
          const exists = prev.some((u) => u.id === latestUser.id);
          if (exists) return prev;
          return [latestUser, ...prev].sort(
            (a, b) => b.registration_timestamp - a.registration_timestamp
          );
        });
      }
    } catch (error) {
      console.error("Error fetching latest user:", error);
    }
  };

  useEffect(() => {
    fetchUsers(true);
  }, []);

  // При додаванні користувача — перевіряємо базу і оновлюємо за датою
  useEffect(() => {
    if (refreshSignal) {
      fetchLatestUser();
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
//
