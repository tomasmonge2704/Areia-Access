import React, { useRef } from "react";
import styles from "../styles/Auth.module.css";

export default function VerificationCode({ setVerificationCode }) {
  const inputs = useRef([]);

  const handleChange = (index, e) => {
    const { value, maxLength } = e.target;
    if (value.length >= maxLength && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
    const newCode = inputs.current.map((input) => input.value).join("");
    setVerificationCode(newCode);
  };

  const handleKeyUp = (index, e) => {
    const { value } = e.target;
    if (e.key === "Backspace" && value === "") {
      if (index > 0) {
        inputs.current[index - 1].focus();
      }
    }
  };

  return (
    <div  style={{marginBottom:"6%",marginTop:"5%"}}>
      {[...Array(6)].map((_, index) => (
        <input
          key={index}
          type="tel"
          maxLength={1}
          pattern="[0-9]*"
          className={styles.inputVerificationCode}
          onChange={(e) => handleChange(index, e)}
          onKeyUp={(e) => handleKeyUp(index, e)}
          ref={(el) => (inputs.current[index] = el)}
        />
      ))}
    </div>
  );
}
