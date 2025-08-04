import UserCard from "../UserCard/UserCard";
import styles from "./Users.module.css";
import avatars from "../../assets/avatars";

const usersData = [
  {
    name: "Salvador Stewart Flynn Thomas",
    details: `Frontend Developer Frontend ...<br />frontend_develop@gmail.com<br />+38 (098) 278 44 24`,
  },
  {
    name: "Takamaru Ayako Jurrien",
    details: `Lead Independent Director <br />Takamuru@gmail.com<br />+38 (098) 278 90 24`,
  },
  {
    name: "Ilya",
    details: `Co-Founder and CEO<br />Ilya_founder@gmail.com<br />+38 (098) 235 44 24`,
  },
  {
    name: "Alexandre",
    details: `Lead Independent Director<br />Alexandr_develop@gmail.com<br />+38 (098) 198 44 24`,
  },
  {
    name: "Winny",
    details: `Former Senior Director<br />Winny_develop@gmail.com<br />+38 (098) 278 22 88`,
  },
  {
    name: "Simon",
    details: `President of Commerce <br />Simon@gmail.com<br />+38 (098) 278 44 00`,
  },
];

function Users() {
  return (
    <section id="users" className={styles["users-section"]}>
      <h2 className={styles["section-title"]}>Working with GET request</h2>
      <div className={styles["user-cards"]}>
        {usersData.map((user, idx) => (
          <UserCard key={idx} avatar={avatars[idx]} {...user} />
        ))}
      </div>
      <button className={styles["show-more-button"]}>Show more</button>
    </section>
  );
}

export default Users;
