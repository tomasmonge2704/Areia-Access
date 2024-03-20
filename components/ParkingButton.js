import MainButton from "./MainButton";

function goToParking(dni){
    window.location.href = `https://parking-festivap.web.app?d=${dni}`;
}

const Parking = ({ styles,dni }) => {
  return (
    <div className={styles.section}>
      <MainButton
        text="PARKING"
        onClick={() => goToParking(dni)}
        buttonStyle={styles.mainButton}
      />
    </div>
  );
};

export default Parking;