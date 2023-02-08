import styles from "../styles/SuccessMessage.module.css";

const SuccessMessage = ({ message }) => {
  return <div className={styles.success}>{message}</div>;
};

export default SuccessMessage;
