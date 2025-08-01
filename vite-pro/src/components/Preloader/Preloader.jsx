import "./Preloader.css";
import spinner from "../../assets/images/spinner.svg";

function Preloader() {
  return (
    <div className="preloader-container">
      <img src={spinner} alt="Loading..." className="spinner-svg" />
    </div>
  );
}

export default Preloader;
