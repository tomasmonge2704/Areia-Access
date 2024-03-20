import styles from "../styles/generate-qr.module.css";
import { signOut } from "next-auth/react";
import MainButton from "./MainButton";
export default function LogoutButton() {
  return (
    <div className={styles.section}>
      <MainButton
        text="Logout"
        onClick={() => signOut()}
        buttonStyle={styles.mainButton}
      />
    </div>
  );
}
