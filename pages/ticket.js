import QrGenerator from "../components/QrGenerator";
import styles from "../styles/Ticket.module.css";

export default function Ticket({ code }) {
  
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h1 className={styles.title}>Invitación AREIA</h1>
        {code && <QrGenerator url={code} size={270} />}
      </div>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  try {
    return {
      props: {
        code: query.code || "",
      },
    };
  } catch {
    return { props: { error: true } };
  }
}
