import * as React from "react";
import Head from "next/head";
import "firebase/auth";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "../styles/globals.css";
import Auth from "../components/auth";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
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
    </SessionProvider>
  );
}

export default MyApp;
