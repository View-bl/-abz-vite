import { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Users from "./components/Users/Users";
import SignupForm from "./components/SignupForm/SignupForm";
import Preloader from "./components/Preloader/Preloader";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [addUserFunc, setAddUserFunc] = useState(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleUserRegistered = (newUser) => {
    if (addUserFunc) {
      addUserFunc(newUser);
    }
  };

  if (isLoading) return <Preloader type="normal" />;

  return (
    <>
      <Header />
      <div className="container">
        <Hero />
        <Users onUserRegistered={setAddUserFunc} />
        <SignupForm onUserRegistered={handleUserRegistered} />
      </div>
    </>
  );
}

export default App;
