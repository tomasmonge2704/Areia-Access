import MainButton from "./MainButton";

function goToParking(dni,email){
    window.location.href = `https://app-areia-dot-parkingya2024.ue.r.appspot.com/#/login?dni=${dni}&email=${email}`;
}

const Parking = ({ styles,dni,email }) => {
  return (
    <div className={styles.section}>
      <MainButton
        text="PARKING"
        onClick={() => goToParking(dni,email)}
        buttonStyle={styles.mainButton}
      />
    </div>
  );
};

export default Parking;