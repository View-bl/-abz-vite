import styles from "./SignupForm.module.css";
// import { useEffect, useState } from "react";
// import { getPositions } from "../../services/api";


function SignupForm() {
  return (
    <section id="signup" className={styles["signup-section"]}>
      <h3 className={styles["section-ti"]}>Working with POST request</h3>
      <form className={styles["signup-form"]}>
        <input
          type="text"
          placeholder="Your name"
          aria-label="Your name"
          required
        />
        <input type="email" placeholder="Email" aria-label="Email" required />
        <div className={styles["phone-wrapper"]}>
          <input type="tel" placeholder="Phone" aria-label="Phone" required />
          <small className={styles["phone-hint"]}>
            +38 (XXX) XXX - XX - XX
          </small>
        </div>
        <fieldset className={styles["radio-group"]}>
          <legend className={styles.legend}>Select your position</legend>

          <label>
            <input
              type="radio"
              name="position"
              value="frontend"
              defaultChecked
            />
            Frontend developer
          </label>

          <label>
            <input type="radio" name="position" value="backend" />
            Backend developer
          </label>

          <label>
            <input type="radio" name="position" value="designer" />
            Designer
          </label>

          <label>
            <input type="radio" name="position" value="qa" />
            QA
          </label>
        </fieldset>
        <div className={styles["file-upload"]}>
          <span
            role="button"
            tabIndex={0}
            className={styles["upload-button"]}
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
          <span className={styles["upload-text"]}>Upload your photo</span>
          <input
            type="file"
            id="photo-upload"
            accept="image/*"
            required
            style={{ display: "none" }}
          />
        </div>

        <button type="submit" className={styles["signup-button"]}>
          Sign up
        </button>
      </form>
    </section>
  );
}

export default SignupForm;
