/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useContext, useCallback } from "react";
import Loader from "react-loader-spinner";
import axios from "axios";
import Link from "next/link";
import Parking from "../components/ParkingButton";
import QrGenerator from "../components/QrGenerator";
import MainButton, { InviteButton } from "../components/MainButton";
import styles from "../styles/generate-qr.module.css";
import ErrorMessage from "../components/ErrorMessage";
import { AuthContext } from "../components/auth";
import LogoutButton from "../components/logoutButton";


const ListOfInvites = ({
  invites,
  appUrl,
  apiUrl,
  getInvitesList,
  userId,
  setErrorMessage,
}) => {
  const updateShareState = async (invitationId) => {
    try {
      const { data } = await axios.put(
        `${apiUrl}/${userId}/invites/${invitationId}`
      );
      if (data.success) {
        getInvitesList();
      }
    } catch (error) {
      setErrorMessage({
        site: "invite",
        message: error.errorMessage || "Hubo un error al compartir",
      });
    }
  };

  const Status = ({ shared, isValidated }) => {
    const icon = isValidated || shared ? "/verify.svg" : "/share.svg";
    return (
      <div>
        <div className={styles.row}>
          {(isValidated || shared) && (
            <p className={styles.paragraph}>
              {isValidated ? "Validada" : "Compartida"}
            </p>
          )}
          <img src={icon} className={styles.icon} style={isValidated ? {filter: "hue-rotate(40deg) saturate(300%)"} : null} />
        </div>
      </div>
    );
  };

  const share = async (title, text, url, shared, invitationId, isValidated) => {
    if (isValidated) {
      return;
    }
    try {
      if (!shared) {
        await window.navigator.share({
          title,
          text,
          url,
        });
        updateShareState(invitationId);
        return;
      }
      if (
        confirm(
          "Esta invitación ya fue compartida, quieres volver a compartirla?"
        )
      ) {
        await window.navigator.share({
          title,
          text,
          url,
        });
      }
    } catch (error) {
      setErrorMessage({
        site: "invite",
        message: error.errorMessage || "Hubo un error al compartir",
      });
    }
  };

  return (
    <>
      {invites.map(({ qrCodeId, _id, shared, createdAt }, index) => {
        const title = "Utiliza este Qr para ingresar al partido";
        const isValidated = qrCodeId.status === "validated";
        const buttonText = `Invitación ${index + 1}`;
        const text = "Invitación de AREIA:\n";
        const url = `${appUrl}/ticket?code=${qrCodeId.code} `;

        const titleWeb = shared
          ? "Este Qr ya fue compartido, quieres compartirlo nuevamente?"
          : "Utiliza este Qr para ingresar al partido";

        return (
          <div key={qrCodeId.code} className={styles.item}>
            <div className={styles.itemContainer}>
              <InviteButton
                secondary
                title={titleWeb}
                text={buttonText}
                url={url}
                buttonStyle={`${styles.sharebutton} ${
                  isValidated && styles.validated
                }`}
                validated={isValidated}
                shared={shared}
                onClick={() =>
                  share(title, text, url, shared, _id, isValidated)
                }
                onShare={() => updateShareState(_id)}
              >
                <Status shared={shared} isValidated={isValidated} />
              </InviteButton>
            </div>
          </div>
        );
      })}
    </>
  );
};

const Generate = ({ loading, qr, generateQr, errorMessage }) => {
  const showError = errorMessage && errorMessage.site === "generate";
  return (
    <div className={styles.section}>
      <img src="logo_ico.png" style={{marginTop:"1.5em"}} />
      <h2>AREIA ACCESS</h2>
      {loading && (
        <Loader
          type="TailSpin"
          color="#F5FF35"
          height={100}
          width={100}
          timeout={3000}
        />
      )}
      {qr && !loading && <QrGenerator url={qr.code} size={220} />}
      {showError && <ErrorMessage error={errorMessage.message} />}
      <MainButton
        text="Generar Código QR de jugador"
        onClick={generateQr}
        buttonStyle={styles.mainButton}
      />
    </div>
  );
};

const Invites = ({
  invites,
  appUrl,
  generateInvite,
  showInvites,
  setShowInvites,
  errorMessage,
  apiUrl,
  getInvitesList,
  userId,
  setErrorMessage,
}) => {
  const showError = errorMessage && errorMessage.site === "invite";
  const hasInvites = invites.length > 0;

  const buttonText = showInvites
    ? "Ocultar invitaciones"
    : "Mostrar invitaciones";
  return (
    <div className={styles.section}>
      <h2>Invitaciones generadas</h2>
      {invites.length > 0 && showInvites && (
        <ListOfInvites
          invites={invites}
          appUrl={appUrl}
          apiUrl={apiUrl}
          getInvitesList={getInvitesList}
          userId={userId}
          setErrorMessage={setErrorMessage}
        />
      )}
      {showError && <ErrorMessage error={errorMessage.message} />}
      {hasInvites && (
        <MainButton
          text={buttonText}
          onClick={() => setShowInvites(!showInvites)}
          buttonStyle={styles.mainButton}
        />
      )}
      {(showInvites || !hasInvites) && (
        <MainButton
          text="Generar una invitación"
          onClick={generateInvite}
          buttonStyle={styles.mainButton}
        />
      )}
    </div>
  );
};

const Captains = () => (
  <div className={styles.section}>
    <h2>Administrar capitanes</h2>
    <Link href="/admin" passHref>
      <MainButton
        text="Administrar Capitanes"
        buttonStyle={styles.mainButton}
      />
    </Link>
  </div>
);

const Tournaments = () => (
  <div className={styles.section}>
    <h2>Administrar torneos</h2>
    <Link href="/tournaments" passHref>
      <MainButton text="Administrar Torneos" buttonStyle={styles.mainButton} />
    </Link>
  </div>
);

const Reader = () => (
  <div className={styles.section}>
    <h2>Escanear Entradas</h2>
    <Link href="/reader" passHref>
      <MainButton text="Escanear Entradas" buttonStyle={styles.mainButton} />
    </Link>
  </div>
);

const GenerateQr = ({ apiUrl, appUrl }) => {
  const [loading, setLoading] = useState(false);
  const [qr, setQr] = useState();
  const [invites, setInvites] = useState([]);
  const [showInvites, setShowInvites] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    //Clean errorMessage
    const handler = setTimeout(() => {
      setErrorMessage({});
    }, 6000);

    return () => {
      clearTimeout(handler);
    };
  }, [errorMessage]);

  const getInvitesList = useCallback(async () => {
    try {
      const invitesListEndpoint = `${apiUrl}/${currentUser._id}/invites`;
      const { data } = await axios.get(invitesListEndpoint);
      setInvites(data);
    } catch (error) {
      setErrorMessage({
        site: "invite",
        message:
          error.errorMessage || "Hubo un error al cargar las invitaciones",
      });
    }
  }, [apiUrl, currentUser?._id]);

  useEffect(() => {
    if (currentUser) {
      getInvitesList();
    }
  }, [currentUser, getInvitesList]);

  const generateQr = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${apiUrl}/generate`, {
        userId: currentUser._id,
      });

      const { error, errorMessage } = data;

      if (error) {
        setErrorMessage({ site: "generate", message: errorMessage });
        return;
      }

      setQr(data);
    } catch (error) {
      setErrorMessage({
        site: "generate",
        message: error.errorMessage || "Hubo un error al generar el QR",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateInvite = async () => {
    try {
      const { data } = await axios.post(`${apiUrl}/invites`, {
        userId: currentUser._id,
      });

      const { error, errorMessage } = data;

      if (error) {
        setErrorMessage({ site: "invite", message: errorMessage });
        return;
      }
      setInvites([...invites, data]);
      setShowInvites(true);
    } catch (error) {
      console.log("error", error);
      setErrorMessage({
        site: "invite",
        message: error.errorMessage || "Hubo un error al generar la invitación",
      });
    }
  };

  if (currentUser) {
    const { rol } = currentUser;
    return (
      <div className={styles.container}>
        <Generate
          loading={loading}
          qr={qr}
          generateQr={generateQr}
          errorMessage={errorMessage}
        />
        <Parking styles={styles} dni={currentUser.dni}/>
        {(rol === 1 || rol === 3) && (
          <Invites
            invites={invites}
            appUrl={appUrl}
            generateInvite={generateInvite}
            showInvites={showInvites}
            setShowInvites={setShowInvites}
            errorMessage={errorMessage}
            apiUrl={apiUrl}
            getInvitesList={getInvitesList}
            userId={currentUser._id}
            setErrorMessage={setErrorMessage}
          />
        )}
        {rol === 3 && (
          <>
            <Tournaments />
            <Captains />
          </>
        )}
        {(rol === 2 || rol === 3) && <Reader />}
          <LogoutButton />
      </div>
    );
  }

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
};

export async function getServerSideProps() {
  try {
    // It's only for testing.
    const apiUrl = process.env.API_URL;
    const appUrl = process.env.APP_URL;

    return {
      props: {
        apiUrl,
        appUrl,
      },
    };
  } catch {
    return { props: { error: true } };
  }
}

export default GenerateQr;
