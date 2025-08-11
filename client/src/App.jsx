import { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Users from "./components/Users/Users";
import SignupForm from "./components/SignupForm/SignupForm";
import Preloader from "./components/Preloader/Preloader";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const fetchUsers = async (pageToFetch) => {
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/users?page=${pageToFetch}&count=6&timestamp=${Date.now()}`
      );
      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();

      if (data.success) {
        const positionNames = {
          1: "Frontend Developer",
          2: "Backend Developer",
          3: "Designer",
          4: "QA",
        };

        const fetchedUsers = data.users.map((user) => ({
          id: user.id,
          name: user.name,
          avatar: user.photo,
          details: `${positionNames[user.position_id] || "Unknown"}<br />${
            user.email
          }<br />${user.phone}`,
          registration_timestamp:
            new Date(user.registration_timestamp).getTime() || 0,
        }));

        if (pageToFetch === 1) {
          setUsers(fetchedUsers);
        } else {
          setUsers((prev) => {
            const combined = [...prev, ...fetchedUsers];
            combined.sort(
              (a, b) => b.registration_timestamp - a.registration_timestamp
            );
            return combined;
          });
        }
        setPage(pageToFetch);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      setErrorUsers(error.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Додаємо нового користувача зверху
  const handleUserRegistered = (newUser) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  if (isLoading) return <Preloader type="normal" />;

  return (
    <>
      <Header />
      <div className="container">
        <Hero />
        <Users
          users={users}
          loading={loadingUsers}
          error={errorUsers}
          fetchMore={() => fetchUsers(page + 1)}
          page={page}
          totalPages={totalPages}
        />
        <SignupForm onUserRegistered={handleUserRegistered} />
      </div>
    </>
  );
}

export default App;
