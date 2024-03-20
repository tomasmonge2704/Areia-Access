import { AuthContext } from "../../components/auth";
import { useContext, useEffect, useState } from "react";
import styles from "../../styles/Admin.module.css";
import { Pagination } from "../../components/pagination";
import axios from "axios";
import MainButton from "../../components/MainButton";
import router from "next/router";
import Loader from "react-loader-spinner";
export default function Users() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const { currentUser } = useContext(AuthContext);
  const isAdmin = currentUser?.rol === 3;
  const labels = ["dni", "rol", "googleId", "Ver mas"];
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.API_URL}/users`, {
          params: {
            page: currentPage,
            limit,
          },
        });
        setUsers(response.data.usuarios);
        setTotalUsers(response.data.total);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleSearchUser = (event) => {
    console.log(event);
    // Implement your search logic here
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (!isAdmin) {
    return (
      <div className={styles.container}>
        <h2>Acceso denegado</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Administrar Usuarios</h2>
      {loading ? (
        <div className={styles.container}>
         <Loader type="TailSpin" color="#F5FF35" height={100} width={100} />
        </div>
      ) : (
        <>
          <input
            type="text"
            onChange={handleSearchUser}
            placeholder="Buscar usuario"
            className={styles.bigInput}
          />
          <div className={styles.alignContent}>
            <div className={styles.row}>
              {labels.map((label, index) => (
                <p className={styles.item} key={index}>
                  {label}
                </p>
              ))}
            </div>
            {users &&
              users.map((user) => (
                <div key={user._id} className={styles.row}>
                  <p className={styles.item}>{user.dni}</p>
                  <p className={styles.item}>{user.rol}</p>
                  <p className={styles.item}>{user.googleId}</p>
                  <div className={`${styles.item} ${styles.buttonContainer}`}>
                    <MainButton
                      text="Ver"
                      onClick={() => {router.push(`users/${user.dni}`)}}
                      secondary
                      buttonStyle={styles.button}
                    />
                  </div>
                </div>
              ))}
            <Pagination
              total={totalUsers}
              setCurrentPage={handlePageChange}
              currentPage={currentPage}
              limit={limit}
            />
          </div>
        </>
      )}
    </div>
  );
}
