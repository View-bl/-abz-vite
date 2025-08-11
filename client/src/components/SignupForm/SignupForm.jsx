import styles from "./SignupForm.module.css";
import { useEffect, useRef, useState } from "react";
import { getToken } from "../../services/apiToken";
import { postUser } from "../../services/apiUsers";
import { validateForm } from "../../utils/validation";
import successIcon from "../../assets/images/User-successfully-registered.svg";

function SignupForm({ onUserRegistered }) {
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position_id: null,
    photo: null,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const successRef = useRef(null);

  useEffect(() => {
    async function loadPositions() {
      try {
        const res = await fetch("https://abz-vite.onrender.com/api/positions");
        const data = await res.json();
        if (data.success) {
          setPositions(data.positions);
        }
      } catch (error) {
        console.error("Failed to load positions:", error);
      }
    }
    loadPositions();
  }, []);

  useEffect(() => {
    if (message === "User successfully registered!" && successRef.current) {
      successRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    let updatedForm = { ...form };
    let updatedErrors = { ...errors };

    if (type === "file") {
      const file = files[0];
      updatedForm.photo = file;

      if (!file || file.type !== "image/jpeg" || file.size > 5 * 1024 * 1024) {
        updatedErrors.photo = "Photo must be a JPEG and ≤ 5MB";
      } else {
        delete updatedErrors.photo;
      }
    } else {
      updatedForm[name] = value;

      switch (name) {
        case "name":
          if (value.trim().length < 2) {
            updatedErrors.name = "Name must be at least 2 characters";
          } else {
            delete updatedErrors.name;
          }
          break;

        case "email":
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            updatedErrors.email = "Invalid email format";
          } else {
            delete updatedErrors.email;
          }
          break;

        case "phone":
          if (
            !/^\+38\s?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(value)
          ) {
            updatedErrors.phone = "Invalid phone format";
          } else {
            delete updatedErrors.phone;
          }
          break;

        case "position_id":
          updatedForm.position_id = Number(value);
          setSelectedPosition(Number(value));
          if (!value) {
            updatedErrors.position = "Please select a position";
          } else {
            delete updatedErrors.position;
          }
          break;

        default:
          break;
      }
    }

    setForm(updatedForm);
    setErrors(updatedErrors);
  };

  const isFormValid = () => {
    return (
      form.name.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
      /^\+38\s?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(
        form.phone
      ) &&
      selectedPosition &&
      form.photo &&
      form.photo.type === "image/jpeg" &&
      form.photo.size <= 5 * 1024 * 1024
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const validationErrors = validateForm(form, selectedPosition);

    if (!selectedPosition) {
      validationErrors.position = "Please select a position";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      const { token } = await getToken();

      // Формуємо formData з усіма полями і файлом
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("position_id", selectedPosition);
      formData.append("photo", form.photo);

      const result = await postUser(formData, token);

      if (result.success) {
        setMessage("User successfully registered!");
        setForm({
          name: "",
          email: "",
          phone: "",
          position_id: null,
          photo: null,
        });
        setSelectedPosition(null);
        document.getElementById("photo-upload").value = null;

        if (onUserRegistered) onUserRegistered();
      } else {
        setMessage(result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      if (
        error.message.includes("User with this phone or email already exist") ||
        error.message.toLowerCase().includes("already exist")
      ) {
        setMessage("User with this email or phone already exists.");
      } else {
        setMessage(error.message || "Error submitting form.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="signup" className={styles["signup-section"]}>
      <h3 className={styles["section-ti"]}>Working with POST request</h3>

      <form className={styles["signup-form"]} onSubmit={handleSubmit}>
        {/* Name */}
        <div className={styles["input-wrapper"]}>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`${styles.input} ${
              errors.name ? styles.errorInput : ""
            }`}
            placeholder=" "
            aria-label="Your name"
          />
          <label htmlFor="name" className={styles.floatingLabel}>
            Your name
          </label>
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>

        <div className={styles["input-wrapper"]}>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`${styles.input} ${
              errors.email ? styles.errorInput : ""
            }`}
            placeholder=" "
            aria-label="Email"
          />
          <label htmlFor="email" className={styles.floatingLabel}>
            Email
          </label>
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        <div
          className={`${styles["phone-wrapper"]} ${styles["input-wrapper"]}`}
        >
          <input
            type="tel"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={`${styles.input} ${
              errors.phone ? styles.errorInput : ""
            }`}
            placeholder=" "
            aria-label="Phone"
          />
          <label htmlFor="phone" className={styles.floatingLabel}>
            Phone
          </label>
          {!errors.phone && (
            <small className={styles["phone-hint"]}>
              +38 (XXX) XXX - XX - XX
            </small>
          )}
          {errors.phone && <p className={styles.error}>{errors.phone}</p>}
        </div>

        {/* Radio buttons */}
        <fieldset className={styles["radio-group"]}>
          <legend
            className={styles.legend}
            style={errors.position ? { color: "#cb3d40" } : {}}
          >
            Select your position
          </legend>
          {positions.map((position) => (
            <label key={position.id} className={styles.radioLabel}>
              <input
                type="radio"
                name="position_id"
                value={position.id}
                checked={Number(selectedPosition) === position.id}
                onChange={handleChange}
              />
              {position.name}
            </label>
          ))}
        </fieldset>

        <div className={styles["input-wrapper"]}>
          <div
            className={`${styles["file-upload"]} ${
              errors.photo ? styles.errorInput : ""
            }`}
          >
            <span
              role="button"
              tabIndex={0}
              className={`${styles["upload-button"]} ${
                errors.photo ? styles.uploadButtonNoBorder : ""
              }`}
              onClick={() => document.getElementById("photo-upload").click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  document.getElementById("photo-upload").click();
                }
              }}
            >
              Upload
            </span>
            <span
              className={`${styles["upload-text"]} ${
                errors.photo ? styles["upload-text-error"] : ""
              }`}
            >
              {form.photo ? form.photo.name : "Upload your photo"}
            </span>

            <input
              type="file"
              id="photo-upload"
              name="photo"
              accept="image/jpeg"
              style={{ display: "none" }}
              onChange={handleChange}
            />
            {errors.photo && (
              <p className={styles.photoError}>{errors.photo}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={`${styles["signup-button"]} ${
            isFormValid() && !loading
              ? styles.activeButton
              : styles.inactiveButton
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Sign up"}
        </button>
      </form>

      {message && (
        <div
          ref={message === "User successfully registered!" ? successRef : null}
          className={styles.successMessageContainer}
        >
          {message === "User successfully registered!" ? (
            <>
              <p className={styles.successMessage}>{message}</p>
              <img
                src={successIcon}
                alt="Success"
                className={styles.successIcon}
                width={64}
                height={64}
              />
            </>
          ) : (
            <p className={styles.errorMessage}>{message}</p>
          )}
        </div>
      )}

      <p className={styles.testSignature}>
        © abz.agency specially for the test task
      </p>
    </section>
  );
}

export default SignupForm;
