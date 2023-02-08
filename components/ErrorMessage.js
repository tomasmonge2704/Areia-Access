import styles from "../styles/ErrorMessage.module.css";

const ErrorMessage = ({ error }) => {
  return <div className={styles.error}>{error}</div>;
};

export default ErrorMessage;
