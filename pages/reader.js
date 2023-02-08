import { useState, useEffect, useCallback, useContext } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import MainButton from "../components/MainButton";
import styles from "../styles/Reader.module.css";
import Loader from "react-loader-spinner";
import { AuthContext } from "../components/auth";
//Fix issue related to Blob
const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

const Reader = ({ apiUrl }) => {
  const [code, setCode] = useState();
  const [result, setResult] = useState();
  const { currentUser } = useContext(AuthContext);

  const handleScan = (data) => {
    if (data) {
      setCode(data);
    }
  };

  const validateQr = useCallback(async () => {
    try {
      const { data } = await axios.post(`${apiUrl}/validate`, {
        code,
        userId: currentUser._id,
      });
      setResult(data);
    } catch (error) {}
  }, [apiUrl, code, currentUser?._id]);

  const enableQr = () => {
    setCode(null);
    setResult(null);
  };

  useEffect(() => {
    if (code && currentUser) {
      validateQr();
    }
  }, [validateQr, code, currentUser]);

  if (!currentUser) {
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

  if (currentUser.rol !== 3 && currentUser.rol !== 2) {
    return (
      <div className={styles.container}>
        <h2>Accesso denegado</h2>
      </div>
    );
  }

  return (
    <div>
      <h1 className={styles.title}>Escanear Entradas</h1>
      <div className={styles.container}>
        {!code && (
          <QrReader
            delay={300}
            onScan={handleScan}
            className={styles.scanner}
          />
        )}
        {result?.success && (
          <div className={`${styles.card} ${styles.success}`}>
            <h2>{result.message}</h2>
          </div>
        )}
        {result?.error && (
          <div className={`${styles.card} ${styles.error}`}>
            <h2>{result.errorMessage}</h2>
          </div>
        )}
        {result?.userInfo && (
          <div>
            <p>Dni: {result.userInfo.dni}</p>
            <p>
              Nombre completo: {result.userInfo.first_name}{" "}
              {result.userInfo.last_name}
            </p>
            {!!result.userInfo.currentTournaments?.length &&
              result?.userInfo.currentTournaments.map((item) => (
                <div key={item.id}>
                  {item?.team_name && <p>Equipo: {item?.team_name}</p>}
                  <p>
                    Torneo: {item?.tournament?.name}
                    {item.tournament.year}
                  </p>
                </div>
              ))}
          </div>
        )}
        {result && (
          <div className={styles.buttonContainer}>
            <MainButton text="Abrir Scanner" onClick={enableQr} />
          </div>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const apiUrl = process.env.API_URL;

    return {
      props: {
        apiUrl,
      },
    };
  } catch {
    return { props: { error: true } };
  }
}

export default Reader;
