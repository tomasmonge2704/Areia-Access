import { IfFirebaseAuthedOr } from "@react-firebase/auth";
import Loader from "react-loader-spinner";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect, createContext, useCallback } from "react";
import firebase from "../firebase/config";
import MainButton from "./MainButton";
import ErrorMessage from "./ErrorMessage";
import useDebounce from "../hooks/useDebounce";
import styles from "../styles/Auth.module.css";

export const AuthContext = createContext({
  googleUser: null,
  currentUser: null,
});

export default function Auth({ children }) {
  const [dni, setDni] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [googleUser, setGoogleUser] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [successDni, setSuccessDni] = useState(false);
  const [loggedSuccess, setLoggedSuccess] = useState(false);
  const debouncedSearchTerm = useDebounce(dni, 800);
  const router = useRouter();

  const authStateChanged = async (user) => {
    setLoading(false);
    setGoogleUser(user?.uid || null);
  };

  useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.API_URL}/user/${googleUser}`
      );

      if (data.error) {
        setLoggedSuccess(false);
        setError(data.errorMessage);
        return;
      }

      if (data) {
        setLoggedSuccess(true);
        setCurrentUser(data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [googleUser]);

  useEffect(() => {
    if (googleUser && error==null) {
      getCurrentUser();
    }
  }, [error, getCurrentUser, googleUser]);

  const verifyDni = async (currentDni) => {
    try {
      setError(false);
      const { data } = await axios.post(`${process.env.API_URL}/verify-dni`, {
        dni: currentDni,
      });

      if (data.error) {
        setSuccessDni(false);
        return setError(data.errorMessage);
      }
      if (data.success) {
        setError(false);
        setSuccessDni(true);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      verifyDni(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const loginWithGoogle = async () => {
    try {
      if (!dni) {
        return setError("Ingrese un dni");
      }

      const successCallback = (user) => {
        setCurrentUser(user);
        setLoggedSuccess(true);
        router.push("/");
      };

      const setErrorCallback = (error) => {
        setCurrentUser(null);
        setLoggedSuccess(false);
        setError(error);
      };

      if (successDni) {
        //Open Login with Google
        await firebase.login(
          process.env.API_URL,
          dni,
          successCallback,
          setErrorCallback
        );
      }
    } catch (error) {}
  };

  const hadleChange = (e) => {
    setSuccessDni(false);
    setDni(e.target.value);
  };

  const publicRoute = router.pathname === "/ticket";

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

  return (
    <>
      {!publicRoute && !loggedSuccess && (
        <div className={styles.container}>
          {error && <ErrorMessage error={error} />}
          <div className={styles.item}>
            <h1 className={styles.title}>Ingresar a AREIA</h1>
            <input
              type="text"
              placeholder="Ingrese su dni"
              onChange={hadleChange}
              className={styles.input}
            />
            <MainButton
              text="Ingresar a AREIA"
              onClick={loginWithGoogle}
              disabled={!successDni}
            />
          </div>
        </div>
      )}
      <IfFirebaseAuthedOr filter={() => publicRoute}>
        <AuthContext.Provider
          value={{
            loading,
            googleUser,
            currentUser,
          }}
        >
          {children}
        </AuthContext.Provider>
      </IfFirebaseAuthedOr>
    </>
  );
}
