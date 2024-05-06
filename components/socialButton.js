import styles from "../styles/MainButton.module.css";

export const SocialButton = ({ onClick, text, disabled, style }) => (
  <button
    className={styles[style]}
    onClick={onClick}
    disabled={disabled}
  >
    {text}
  </button>
);