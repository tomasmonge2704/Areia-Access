import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "../styles/Auth.module.css";
import ErrorMessage from "./ErrorMessage";
import MainButton from "./MainButton";
import { verifyDni } from "./ultis";
import axios from "axios";
import { SocialButton } from "./socialButton";
import VerificationCode from "./verificationCode";

export default function LoginPage({err}) {
  const [error, setError] = useState(err);
  const [successDni, setSuccessDni] = useState(false);
  const [viewLogin, setViewLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState(false);
  const [dni, setDni] = useState();
  const handleChange = (event) => {
    setDni(event.target.value);
  };
  useEffect(() => {
    setError(err);
  },[err])
  useEffect(() => {
    // Expresión regular para validar el formato del DNI peruano (8 dígitos numéricos)
    const dniRegex = /^\d{8}$/;
    if (dni && dniRegex.test(dni)) {
      localStorage.setItem("dni", dni);
      verifyDni(dni, setError, setSuccessDni);
    } else {
      setSuccessDni(false);
    }
  },[dni])
  const confirmEmail = async () => {
    // Expresión regular para validar el formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Verificar si el correo electrónico es válido antes de marcarlo como verificado
    if (email && emailRegex.test(email)) {
      const { data } = await axios.post(`${process.env.API_URL}/verifyEmail`, {
        dni,
        email,
      });
      if(data.email) setVerifiedEmail(true);
      if(error) setError(undefined);
      if(data.errorMessage) setError(data.errorMessage);
    } else {
     setError('Formato del email invalido')
    }
  }
  const handleConfirmLogin = async () => {
    try {
      const res = await signIn("credentials", {
        email,
        password: verificationCode, // Utiliza el código de verificación como contraseña
      });
      console.log(res);
    } catch (err) {
      console.log(err);
      setError("Error de servidor");
    }
  };

  const handleFacebookLogin = async () => {
    await signIn("facebook");
  };

  const handleGoogleLogin = async () => {
    await signIn("google");
  };
  
  return (
    <>
      <div className={styles.container}>
        {error && <ErrorMessage error={error} />}
        <div className={styles.item}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img src="logo.webp" style={{ margin: "1.5em" }} />
          </div>
          {successDni && viewLogin ? (
            <>
            {verifiedEmail ? (
            <>
            <input
                type="email"
                placeholder="Email"
                disabled={true}
                value={email}
                className={styles.input}
                style={{marginBottom:"6%"}}
              /> 
              <VerificationCode setVerificationCode={setVerificationCode}/>
              <MainButton
              text="Confirmar"
              onClick={handleConfirmLogin}
            />
            </>) : (<>
              
            <input
                type="mail"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={styles.input}
              />
              <MainButton
              text="continuar"
              onClick={confirmEmail}
            />
             <div className={styles.separator}>
            <hr className={styles.line} />
            <span>O</span>
            <hr className={styles.line} />
          </div>
            <div>
            <SocialButton text="Iniciar sesión con Facebook" onClick={handleFacebookLogin} style='FacebookButton'/>
            <SocialButton text="Iniciar sesión con Google" onClick={handleGoogleLogin} style='GoogleButton'/>
          </div>
            </>
              )}
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Ingrese su dni"
                value={dni}
                onChange={handleChange}
                className={styles.input}
              />
              <MainButton
                text="Ingresar a AREIA"
                onClick={() => setViewLogin(true)}
                disabled={!successDni}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
