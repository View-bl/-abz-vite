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

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      let allUsers = [];
      let pageToFetch = 1;
      let totalPages = 1;

      while (pageToFetch <= totalPages) {
        const res = await fetch(
          `${API_BASE_URL}/api/users?page=${pageToFetch}&count=6`
        );
        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();

        if (!data.success) throw new Error("Failed to load users");

        totalPages = data.total_pages;

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

        allUsers = allUsers.concat(fetchedUsers);
        pageToFetch++;
      }

      allUsers.sort(
        (a, b) => b.registration_timestamp - a.registration_timestamp
      );
      setApiUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Початкове завантаження користувачів
  useEffect(() => {
    fetchUsers();
  }, []);

  // Оновлення користувачів при зміні refreshSignal
  useEffect(() => {
    fetchUsers();
  }, [refreshSignal]);

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
    </section>
  );
}

export default Users;
