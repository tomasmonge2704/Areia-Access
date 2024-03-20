import styles from "../styles/Admin.module.css";

export const Pagination = ({ total, setCurrentPage, currentPage, limit}) => {
    const totalOfPages = Math.ceil(Number(total) / limit) || 1;
  
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