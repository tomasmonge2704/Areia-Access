import axios from "axios";
import app from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGIN_SENDER_ID,
  appId: process.env.FB_APP_ID,
};

class Firebase {
  constructor() {
    if (!app.apps.length) {
      app.initializeApp(firebaseConfig);
    }

    this.auth = app.auth();
    this.google = new app.auth.GoogleAuthProvider();
    this.google.setCustomParameters({
      prompt: "select_account",
    });
  }

  async login(apiUrl, dni, successCallback, errorCallback) {
    try {
      const auth = await this.auth.signInWithPopup(this.google);

      if (!auth.user) {
        errorCallback("Ocurrio un error al cargar el usuario de google");
      }

      if (auth.user) {
        const { data } = await axios.post(`${apiUrl}/login`, {
          dni,
          googleId: auth.user.uid,
          email: auth.user.email,
        });

        if (!data || data.error) {
          errorCallback(data.errorMessage);
          return this.auth.signOut();
        }

        if (data) {
          successCallback(data);
        }
      }
    } catch (error) {
      errorCallback("Ocurrió un error al inciar sesión en Google");
    }
  }
}

const firebase = new Firebase();

export { firebaseConfig };

export default firebase;
