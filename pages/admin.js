import axios from "axios";
import { useState, useEffect, useCallback, useContext } from "react";
import Loader from "react-loader-spinner";
import MainButton from "../components/MainButton";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import useDebounce from "../hooks/useDebounce";
import styles from "../styles/Admin.module.css";
import { AuthContext } from "../components/auth";

const labels = ["Nombre", "Invitaciones", "Actualizar"];
const LIMIT_FOR_PAGE = 10;

const Pagination = ({ totalOfCaptains, setCurrentPage, currentPage }) => {
  const totalOfPages = Math.ceil(Number(totalOfCaptains) / LIMIT_FOR_PAGE) || 1;

  return (
    <div className={`${styles.row} ${styles.pagination}`}>
      <div className={styles.paginationContainer}>
        {currentPage > 1 && (
          <button
            className={`${styles.paginationButton} ${styles.joystick}`}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            {"< Anterior"}
          </button>
        )}
        <p className={styles.alignItems}>
          <span className={`${styles.paginationButton} ${styles.currentPage}`}>
            {currentPage}
          </span>
          {`de ${totalOfPages}`}
        </p>
        {totalOfPages > currentPage && (
          <button
            className={`${styles.paginationButton} ${styles.joystick}`}
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
          >
            {"Siguiente >"}
          </button>
        )}
      </div>
    </div>
  );
};

const Admin = ({ apiUrl, tournaments }) => {
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();
  const [captainsList, setCaptainList] = useState();
  const [numberGlobal,setNumberGlobal] = useState(8);
  const [captainsAmount, setCaptainsAmount] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [tournament, setTournament] = useState();
  const [loading, setLoading] = useState();
  const { currentUser } = useContext(AuthContext);
  const debouncedSearchTerm = useDebounce(search, 500);
  const isAdmin = currentUser?.rol === 3;

  const updateCaptainAmount = async (captain) => {
    if (isNaN(captain.maxInviteCount)) {
      return setErrorMessage("El valor debe ser un número");
    }

    const { data } = await axios.put(`${apiUrl}/update-captain`, {
      externalCaptainId: captain.externalCaptainId,
      maxInviteCount: captain.maxInviteCount,
    });

    if (data.error) {
      return setErrorMessage(data.errorMessage);
    }
    setSuccessMessage("Capitan actualizado correctamente");
  };
  const handleUpdateAllCaptains = async (number) => {
    try {
      const { data } = await axios.put(
        `${apiUrl}/update-captains`,{
          nuevoMaxInviteCount:number
        }
      );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }
  const handleChange = (e, captain) => {
    const captainId = captain._id;

    const listOfCaptains = captainsList.map((item) => {
      if (item._id === captainId) {
        item.maxInviteCount = Number(e.target.value);
      }
      return item;
    });

    setCaptainList(listOfCaptains);
  };

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const searchCaptains = useCallback(
    async (term) => {
      try {
        const { data } = await axios.get(
          `${apiUrl}/list-captains?term=${term}&page=${currentPage}&tournament=${tournament}&userId=${currentUser._id}`
        );
        setCaptainList(data.captains);
        setCaptainsAmount(data.totalOfCaptains);
      } catch (error) {}
    },
    [apiUrl, currentPage, currentUser?._id, tournament]
  );

  const onChangeTournament = (e) => {
    setTournament(e.target.value);
    setCurrentPage(1);
  };

  const fetchCaptains = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${apiUrl}/list-captains?resync=true&userId=${currentUser._id}`
      );
      const { captains, totalOfCaptains } = data;
      setCaptainList(captains);
      setCaptainsAmount(totalOfCaptains);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [apiUrl, currentUser?._id]);

  useEffect(() => {
    if (isAdmin && (debouncedSearchTerm || currentPage)) {
      searchCaptains(debouncedSearchTerm);
    }
  }, [
    debouncedSearchTerm,
    searchCaptains,
    currentPage,
    tournament,
    currentUser,
    isAdmin,
  ]);

  useEffect(() => {
    if (isAdmin) {
      fetchCaptains();
    }
  }, [fetchCaptains, isAdmin]);

  useEffect(() => {
    //Clean messages
    const handler = setTimeout(() => {
      setErrorMessage(null);
      setSuccessMessage(null);
    }, 4000);

    return () => {
      clearTimeout(handler);
    };
  }, [errorMessage, successMessage]);

  if (!currentUser) {
    return (
      <div className={styles.container}>
        <Loader type="TailSpin" color="#F5FF35" height={100} width={100} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={styles.container}>
        <h2>Accesso denegado</h2>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <h2>Administrar capitanes</h2>
      {loading ? (
        <div className={styles.container}>
          <Loader type="TailSpin" color="#F5FF35" height={100} width={100} />
        </div>
      ) : (
        <>
          <input
            type="text"
            onChange={onChangeSearch}
            placeholder="Buscar capitan"
            className={styles.bigInput}
          />
          <select
            name="select"
            className={styles.bigInput}
            onChange={onChangeTournament}
          >
            <option value="">Todos los torneos</option>
            {tournaments?.map((tournament) => (
              <option key={tournament._id} value={tournament._id}>
                {`${tournament.name} ${tournament.year}`}
              </option>
            ))}
          </select>
          {errorMessage && <ErrorMessage error={errorMessage} />}
          {successMessage && <SuccessMessage message={successMessage} />}
          <div className={styles.row}>
              <p className={styles.item}>Todos los capitanes</p>
              <input
                name="amount"
                type="number"
                defaultValue={numberGlobal}
                onChange={(e) => setNumberGlobal(e.target.value)}
                className={`${styles.item} ${styles.input}`}
              />
              <div className={`${styles.item} ${styles.buttonContainer}`}>
                <MainButton
                  text="Actualizar"
                  secondary
                  onClick={() => handleUpdateAllCaptains(numberGlobal)}
                  buttonStyle={styles.button}
                />
              </div>
            </div>
          <div className={styles.alignContent}>
            <div className={styles.row}>
              {labels.map((label, index) => (
                <p className={styles.item} key={index}>
                  {label}
                </p>
              ))}
            </div>
            {captainsList &&
              captainsList.map((captain) => (
                <div key={captain._id} className={styles.row}>
                  <p className={styles.item}>{captain.name}</p>
                  <input
                    name="amount"
                    type="number"
                    defaultValue={captain.maxInviteCount}
                    className={`${styles.item} ${styles.input}`}
                    onChange={(e) => handleChange(e, captain)}
                  />
                  <div className={`${styles.item} ${styles.buttonContainer}`}>
                    <MainButton
                      text="Actualizar"
                      onClick={() => updateCaptainAmount(captain)}
                      secondary
                      buttonStyle={styles.button}
                    />
                  </div>
                </div>
              ))}
            <Pagination
              totalOfCaptains={captainsAmount}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const apiUrl = process.env.API_URL;
    const { data } = await axios.get(`${apiUrl}/list-tournaments`);

    return {
      props: {
        apiUrl,
        tournaments: data?.tournaments,
      },
    };
  } catch {
    return { props: { error: true } };
  }
}

export default Admin;
