import { useEffect, useState } from "react";
import UserCard from "../UserCard/UserCard";
import styles from "./Users.module.css";
import { formatPhone } from "../../utils/formatPhone"; 

const positionNames = {
  1: "Frontend Developer",
  2: "Backend Developer",
  3: "Designer",
  4: "QA",
};

function Users({ refreshSignal }) {
  const [apiUsers, setApiUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (reset = false) => {
    setLoading(true);
    try {
      const pageToFetch = reset ? 1 : page + 1;

      const res = await fetch(`/api/users?page=${pageToFetch}&count=6`);
      const data = await res.json();

      if (data.success) {
        const fetchedUsers = data.users.map((user) => ({
          id: user.id,
          name: user.name,
          avatar: user.photo,
          details: `${positionNames[user.position_id] || "Unknown"}<br />${
            user.email
          }<br />${formatPhone(user.phone)}`, // ✅ форматований номер
          registration_timestamp:
            new Date(user.registration_timestamp).getTime() || 0,
        }));

        if (reset) {
          fetchedUsers.sort(
            (a, b) => b.registration_timestamp - a.registration_timestamp
          );
          setApiUsers(fetchedUsers);
          setPage(1);
        } else {
          setApiUsers((prev) => {
            const combined = [...prev, ...fetchedUsers];
            combined.sort(
              (a, b) => b.registration_timestamp - a.registration_timestamp
            );
            return combined;
          });
          setPage(pageToFetch);
        }

        setTotalPages(data.total_pages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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

      <div className={styles["user-cards"]}>
        {apiUsers.map((user) => (
          <UserCard key={user.id} {...user} />
        ))}
      </div>

      {loading && <p>Loading...</p>}

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
