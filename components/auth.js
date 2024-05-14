import { useSession } from "next-auth/react";
import { createContext, useState, useEffect } from "react";
import styles from "../styles/Auth.module.css";
import Loader from "react-loader-spinner";
import axios from "axios";
import { hideEmail, updateEmailUser } from "./ultis";
import LoginPage from "./login";
export const AuthContext = createContext({
  currentUser: null,
});

export default function Auth({ children }) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [dni, setDni] = useState(undefined);
  useEffect(async () => {
      // Si la sesión existe, establece el usuario actual
      const getDni = localStorage.getItem("dni");
      setDni(getDni);
      const { data } = await axios.get(`${process.env.API_URL}/users/${getDni}`);
      setLoading(false);
      const { email } = data.mongoUser;
      if (session?.user?.email && getDni) {
        if (email === session.user.email) {
          setCurrentUser(data.mongoUser);
        }
        console.log(email);
        if(!email && session.user) {
          const newUser = {...data.mongoUser,email:session.user.email}
          updateEmailUser(newUser);
          setCurrentUser(newUser);
        }
        if(email && email  !== session.user.email){
          console.log(data?.mongoUser?.email);
          setError(
            `El DNI ${dni} esta asociado al email ${hideEmail(
              data?.mongoUser?.email
            )} y no a ${hideEmail(session.user.email)}`
          );
        }
      }
  }, [session]);

  return (
    <>
      {loading ? (
        <div className={styles.container}>
          <Loader
            type="TailSpin"
            color="#F5FF35"
            height={100}
            width={100}
            timeout={3000}
          />
        </div>
      ) : (
        <>
          {currentUser ? (
            <AuthContext.Provider
            value={{
              loading,
              currentUser,
            }}
          >
            {children}
          </AuthContext.Provider>
          ) : (
            <LoginPage err={error}/>
          )}
        </>
      )}
    </>
  );
}
