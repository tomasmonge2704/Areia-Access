import axios from "axios";
export const verifyDni = async (currentDni,setError,setSuccessDni) => {
    try {
      setError(false);
      const { data } = await axios.post(`${process.env.API_URL}/verify-dni`, {
        dni: currentDni,
      });

      if (data.error) {
        setSuccessDni(false);
        return setError(data.errorMessage);
      }
      if (data.success) {
        setError(false);
        setSuccessDni(true);
      }
    } catch (error) {
        console.log(error)
        return false
    }
  };
export const hideEmail = function (email) {
  if(!email) return '';
  return email.replace(/(.{2})(.*)(?=@)/,
    function (gp1, gp2, gp3) {
      for (let i = 0; i < gp3.length; i++) {
        gp2 += "*";
      } return gp2;
    });
};
const loginWithGoogle = async () => {
    try {
      if (!dni) {
        return setError("Ingrese un dni");
      }

      const successCallback = (user) => {
        setCurrentUser(user);
        setLoggedSuccess(true);
        router.push("/");
      };

      const setErrorCallback = (error) => {
        setCurrentUser(null);
        setLoggedSuccess(false);
        setError(error);
      };

      if (successDni) {
        //Open Login with Google
        await firebase.login(
          process.env.API_URL,
          dni,
          successCallback,
          setErrorCallback
        );
      }
    } catch (error) {}
  };