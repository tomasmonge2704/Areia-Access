import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react";
import styles from "../styles/Auth.module.css";
import ErrorMessage from "../components/ErrorMessage";
import MainButton from "../components/MainButton";
import { verifyDni } from "../components/ultis";
import { useRouter } from "next/router";

export default function Component() {
  const { data: session } = useSession()
  const [error, setError] = useState();
  const [successDni, setSuccessDni] = useState(false);
  const router = useRouter();

  const handleChange = (event) => {
    const dni = event.target.value;
    // Expresión regular para validar el formato del DNI peruano (8 dígitos numéricos)
    const dniRegex = /^\d{8}$/;
    if (dni && dniRegex.test(dni)) {
      verifyDni(dni, setError, setSuccessDni);
    }
  };
  if (session) {
    router.push("/");
  }
  return (
    <>
     <div className={styles.container}>
      {error && <ErrorMessage error={error} />}
      <div className={styles.item}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src="logo.webp" style={{ margin: "1.5em" }} />
        </div>
        
            <input
              type="text"
              placeholder="Ingrese su dni"
              onChange={handleChange}
              className={styles.input}
            />
            <MainButton
              text="Ingresar a AREIA"
              onClick={() => signIn()}
              disabled={!successDni}
            />
      </div>
    </div>
    </>
  )
}