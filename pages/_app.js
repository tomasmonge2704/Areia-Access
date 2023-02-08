import * as React from "react";
import Head from "next/head";
import "firebase/auth";
import firebase from "firebase/app";
import { FirebaseAuthProvider } from "@react-firebase/auth";
import { config } from "../firebase/config";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "../styles/globals.css";
import Auth from "../components/auth";

function MyApp({ Component, pageProps }) {
  return (
    <FirebaseAuthProvider firebase={firebase} {...config}>
      <Head>
        <title>AREIA</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <Auth>
        <Component {...pageProps} />
      </Auth>
    </FirebaseAuthProvider>
  );
}

export default MyApp;
