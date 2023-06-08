import MainButton from "./MainButton";

function goToParking(){
    window.location.href = "https://parking-festivap.web.app/";
}

const Parking = ({ styles }) => {
  return (
    <div className={styles.section}>
      <MainButton
        text="PARKING"
        onClick={goToParking}
        buttonStyle={styles.mainButton}
      />
    </div>
  );
};

export default Parking;