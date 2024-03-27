import { useRouter } from "next/router";
import { AuthContext } from "../../components/auth";
import { useContext, useEffect, useState } from "react";
import axios from "axios"; // Import axios
import styles from "../../styles/Admin.module.css";
import Loader from "react-loader-spinner";
import MainButton from "../../components/MainButton";
import SuccessMessage from "../../components/SuccessMessage";
import ErrorMessage from "../../components/ErrorMessage";
export default function User() {
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();
  const router = useRouter();
  const { id } = router.query;
  const { currentUser } = useContext(AuthContext);
  const isAdmin = currentUser?.rol === 3;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(undefined);
  const [rol, setRole] = useState(undefined);
  // Check if user is not admin
  if (!isAdmin) {
    return (
      <div className={styles.container}>
        <h2>Acceso denegado</h2>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use id instead of dni
        const { data } = await axios.get(`${process.env.API_URL}/users/${id}`);
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    // Call the fetchData function
    fetchData();
  }, [id]); // Add id as a dependency
  const handleDelete = async () => {
    try {
      if (user.mongoUser) {
        const { data } = await axios.delete(
          `${process.env.API_URL}/users/${user.mongoUser._id}`
        );
        setSuccessMessage(data.message);
      }
    } catch (error) {
      setErrorMessage(error);
    }
  };
  const handleEdit = async () => {
    try {
      if (user.mongoUser) {
        const { data } = await axios.put(
          `${process.env.API_URL}/users/${user.mongoUser._id}`,{...user.mongoUser,rol}
        );
        setSuccessMessage(`Usuario ${data.dni} editado con exito`);
      }
    } catch (error) {
      setErrorMessage(error);
    }
  };
  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.container}>
          <Loader type="TailSpin" color="#F5FF35" height={100} width={100} />
        </div>
      ) : (
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            { user?.proveedor && <div className={styles.section}>
                
              <h2>Todo torneos</h2>
              <p>DNI: {user.proveedor.dni}</p>
              <p>Nombre: {user.proveedor.first_name}</p>
              <div className={styles.row}>
                <p className={styles.item}>equipo</p>
                <p className={styles.item}>torneo</p>
              </div>
              <div className={styles.row}>
                
                {user.proveedor.lineups.map((e, index) => (
                  <div
                    className={styles.row}
                    key={index}
                    style={{ border: "0px" }}
                  >
                    <p className={styles.item}>{e.team_name}</p>
                    <p className={styles.item}>{e.tournament.name}</p>
                  </div>
                ))}
              </div>
            </div>}
            {user?.mongoUser && <div className={styles.section}>
                
              <h2>Mongo</h2>
              {errorMessage && <ErrorMessage error={errorMessage} />}
              {successMessage && <SuccessMessage message={successMessage} />}
              <p>DNI: {user.mongoUser.dni}</p>
              <div className={styles.row} style={{ border: "0px" }}>
                <p>Rol: </p>{" "}
                <input
                  name="amount"
                  type="number"
                  onChange={(event) => setRole(event.target.value)}
                  defaultValue={user.mongoUser.rol}
                  className={`${styles.item} ${styles.input}`}
                />
              </div>

              <p>mail: {user.mongoUser.email}</p>
              <p>googleId: {user.mongoUser.googleId}</p>
              <div className={styles.row} style={{ border: "0px" }}>
                <MainButton
                  text="editar"
                  secondary
                  onClick={() => handleEdit()}
                  buttonStyle={styles.button}
                />
                <MainButton
                  text="borrar"
                  secondary
                  onClick={() => handleDelete()}
                  buttonStyle={styles.button}
                />
              </div>
             
            </div>}
            {!user && <div className={styles.section}>
              <h2>Usuario no encontrado</h2>
            </div>
              }
          </div>
        </>
      )}
    </div>
  );
}
