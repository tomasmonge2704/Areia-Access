import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "../styles/Auth.module.css";
import ErrorMessage from "./ErrorMessage";
import MainButton from "./MainButton";
import { verifyDni } from "./ultis";
import { useRouter } from "next/router";
import axios from "axios";

export default function LoginPage() {
  const { data: session } = useSession();
  const [error, setError] = useState();
  const [successDni, setSuccessDni] = useState(false);
  const router = useRouter();
  const handleChange = (event) => {
    const dni = event.target.value;
    // Expresión regular para validar el formato del DNI peruano (8 dígitos numéricos)
    const dniRegex = /^\d{8}$/;
    if (dni && dniRegex.test(dni)) {
      localStorage.setItem("dni", dni);
      verifyDni(dni, setError, setSuccessDni);
    }
  };
  useEffect(async () => {
    if (session?.user?.email) {
      const dni = localStorage.getItem("dni");
      try {
        const { data } = await axios.post(`${process.env.API_URL}/login`, {
          dni,
          email: session.user.email,
        });
        if (data.errorMessage) {
          setError(data.errorMessage);
        }
      } catch (err) {
        setError('Error de servidor');
      }
    }
  }, [session]);
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
  );
}
