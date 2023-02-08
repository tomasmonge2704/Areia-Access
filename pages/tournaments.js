import React, { useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";
import Loader from "react-loader-spinner";
import { AuthContext } from "../components/auth";
import MainButton from "../components/MainButton";
import ErrorMessage from "../components/ErrorMessage";
import styles from "../styles/Tournaments.module.css";

const EditAction = ({ onUpdate, loading, onCancel, edit, onPressEdit }) => (
  <>
    <MainButton
      text={edit ? "Actualizar configuración" : "Editar configuración"}
      onClick={edit ? onUpdate : onPressEdit}
      disabled={loading}
    />
    {edit && (
      <MainButton
        text="Cancelar"
        secondary
        buttonStyle={styles.buttonSecondary}
        onClick={onCancel}
      />
    )}
  </>
);

const formatingDate = (date) =>
  new Date(new Date(date).toString().split("GMT")[0] + " UTC")
    .toISOString()
    .split(".")[0]
    .slice(0, -3);

export default function Tournaments({ tournaments, apiUrl, config }) {
  const { currentUser } = useContext(AuthContext);
  const isAdmin = currentUser?.rol === 3;
  const [loading, setLoading] = useState(false);
  const [currentYearFilter, setCurrentYearFilter] = useState(
    config?.minTournamentYear
  );
  const [activeTournaments, setActiveTournaments] = useState(tournaments);
  const [error, setError] = useState(false);
  const [value, setValue] = useState(currentYearFilter || "");
  const [edit, setEdit] = useState(false);
  const formatedDate =
    config?.expirationDate && formatingDate(config?.expirationDate);
  const [currentExpiration, setCurrentExpiration] = useState(formatedDate);
  const [date, setDate] = useState(currentExpiration || "");

  const onChangeSearch = (e) => {
    if (value?.length >= 4) {
      return setValue(e.target.value.slice(0, 4));
    }
    setValue(e.target.value);
  };

  const onChangeDate = (e) => setDate(e.target.value);

  const submitUpdate = async () => {
    try {
      setLoading(true);
      const dateUtc = date ? new Date(date).toUTCString() : null;
      const { data } = await axios.post(`${apiUrl}/config`, {
        minTournamentYear: value,
        expirationDate: dateUtc,
      });
      if (data?.errorMessage) {
        return setError(data?.errorMessage);
      }
      const formatedDate =
        data?.config?.expirationDate &&
        formatingDate(data?.config?.expirationDate);
      setCurrentExpiration(formatedDate);
      setCurrentYearFilter(data.config.minTournamentYear);
      setValue(data.config.minTournamentYear);
      setEdit(false);
    } catch (error) {
      setError("Ocurrió un error al actualizar los torneos habilitados");
    } finally {
      setLoading(false);
    }
  };

  const cancelAction = () => {
    setValue(currentYearFilter);
    setEdit(false);
  };

  const getTournaments = useCallback(async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/list-tournaments`);
      if (data?.errorMessage) {
        return setError(data?.errorMessage);
      }
      setActiveTournaments(data?.tournaments);
    } catch (error) {
      setError("Ocurrió un error al obtener los torneos");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl, currentYearFilter]);

  const onToggle = useCallback(
    async (id, value) => {
      try {
        const newArray = activeTournaments.map((item) => {
          if (item._id === id) {
            return {
              ...item,
              enable: value,
            };
          }
          return item;
        });
        axios.post(`${apiUrl}/tournament/enable`, {
          tournamentId: id,
          value,
        });
        setActiveTournaments(newArray);
      } catch (error) {
        setError("Ocurrió un error al actualizar el torneo");
      }
    },
    [activeTournaments, apiUrl]
  );

  useEffect(() => {
    if (isAdmin) {
      getTournaments();
    }
  }, [getTournaments, isAdmin]);

  const currentDate = formatingDate(new Date().toISOString());

  if (!isAdmin) {
    return (
      <div className={styles.container}>
        <h2>Accesso denegado</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Gestionar torneos</h1>
      <div className={styles.inputContainer}>
        <label itemID="search" className={styles.title}>
          Filtrar torneos habilitados:
        </label>
        <div className={styles.editRow}>
          <input
            id="search"
            name="search"
            onChange={onChangeSearch}
            placeholder="Año"
            className={styles.bigInput}
            value={value}
            disabled={!edit}
            type="number"
            maxLength="4"
          />
        </div>
      </div>
      <div className={styles.inputContainer}>
        <label itemID="date" className={styles.title}>
          Fecha de expiración de entradas:
        </label>
        <div className={styles.editRow}>
          <input
            id="date"
            name="date"
            onChange={onChangeDate}
            className={styles.bigInput}
            value={date}
            type="datetime-local"
            min={currentDate}
            disabled={!edit}
          />
        </div>
      </div>
      <EditAction
        onCancel={cancelAction}
        onUpdate={isAdmin && submitUpdate}
        loading={loading}
        edit={edit}
        onPressEdit={() => setEdit(true)}
      />
      {error && (
        <div className={styles.error}>
          <ErrorMessage error={error} />
        </div>
      )}
      {loading ? (
        <div className={styles.container}>
          <Loader type="TailSpin" color="#F5FF35" height={100} width={100} />
        </div>
      ) : (
        <ul className={styles.listContainer}>
          <h4>Habilita o deshabilita torneos particulares</h4>
          {activeTournaments.map(({ name, year, enable, _id }) => (
            <li className={styles.tournament} key={`${name}-${year}`}>
              <input
                type="checkbox"
                checked={enable}
                onChange={() => onToggle(_id, !enable)}
              />
              Torneo: {name} - Año: {year}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const apiUrl = process.env.API_URL;
    const { data } = await axios.get(`${apiUrl}/list-tournaments`);

    return {
      props: {
        apiUrl,
        tournaments: data?.tournaments,
        config: data?.config,
      },
    };
  } catch {
    return { props: { error: true } };
  }
}
