import { useSession } from "next-auth/react";
import { createContext, useState, useEffect } from "react";
import styles from "../styles/Auth.module.css";
import Loader from "react-loader-spinner";
import axios from "axios";
import { useRouter } from "next/router";
import LoginPage from "./login";
export const AuthContext = createContext({
  currentUser: null,
});


export default function Auth({ children }) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(undefined);
  const router = useRouter();
  useEffect(async () => {
    if (status === "loading") {
      // Si está cargando la sesión, muestra el loader
      setLoading(true);
    } else {
      setLoading(false);
      // Si la sesión existe, establece el usuario actual
      if (session) {
        console.log(session)
        const dni = localStorage.getItem('dni');
        const { data } = await axios.get(`${process.env.API_URL}/users/${dni}`);
        if(data.email === session.email){ 
          setCurrentUser(data.mongoUser);
        }
      }
    }
  }, [session, status]);

  if (loading) {
    return (
      <div className={styles.container}>
        <Loader
          type="TailSpin"
          color="#F5FF35"
          height={100}
          width={100}
          timeout={3000}
        />
      </div>
    );
  }

  if (currentUser) {
    return (
      <AuthContext.Provider
        value={{
          loading,
          currentUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  } else {
    return <LoginPage/>
  }
}
