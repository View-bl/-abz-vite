import { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Users from "./components/Users/Users";
import SignupForm from "./components/SignupForm/SignupForm";
import Preloader from "./components/Preloader/Preloader";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // затрима для завантаження
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Preloader type="normal" />;
  return (
    <>
      <Header />
      <div className="container">
        <Hero />
        <Users />
        <SignupForm />
      </div>
    </>
  );
}
export default App;
