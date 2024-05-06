import styles from "../styles/Auth.module.css";
import { useRouter } from "next/router";
import MainButton from "./MainButton";
import ErrorMessage from "../components/ErrorMessage";
export default function Unauthorized ({err}) {
    const router = useRouter();

    return(
        <div className={styles.container}>
        <div className={styles.item} style={{textAlign:"center"}}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img src="logo.webp" style={{ margin: "1.5em" }} />
          </div>
          {err ? <ErrorMessage error={err}/> : <h2>Usuario no Autorizado</h2>}
          <MainButton
              text="Ir al Login"
              onClick={() => router.push('/login')}
            />
        </div>
      </div>
    )
}