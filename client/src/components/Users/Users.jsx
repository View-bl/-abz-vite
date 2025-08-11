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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 6;

  const fetchUsers = async (pageToFetch = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/users?page=${pageToFetch}&count=${usersPerPage}`
      );
      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();

      if (!data.success) throw new Error("Failed to load users");

      setTotalUsers(data.total_users || 0);

      const fetchedUsers = data.users.map((user) => ({
        id: user.id,
        name: user.name,
        avatar: user.photo,
        details: `${positionNames[user.position_id] || "Unknown"}<br />${
          user.email
        }<br />${formatPhone(user.phone)}`,
        registration_timestamp:
          new Date(user.registration_timestamp * 1000).getTime() || 0,
      }));

      if (pageToFetch === 1) {
        setApiUsers(fetchedUsers);
      } else {
        setApiUsers((prev) => [...prev, ...fetchedUsers]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Завантаження першої сторінки або при оновленні
  useEffect(() => {
    setPage(1);
    fetchUsers(1);
  }, [refreshSignal]);

  // Обробка натискання кнопки "Load more"
  const handleLoadMore = () => {
    if (!loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUsers(nextPage);
    }
  };

  // Кількість завантажених користувачів
  const loadedUsersCount = apiUsers.length;

  // Чи показувати кнопку
  const canLoadMore = loadedUsersCount < totalUsers && loadedUsersCount < 47;

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

      {canLoadMore && !loading && (
        <button className={styles.loadMoreButton} onClick={handleLoadMore}>
          Load more
        </button>
      )}
    </section>
  );
}

export default Users;
