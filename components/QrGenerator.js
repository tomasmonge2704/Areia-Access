import React from "react";
import QRCode from "qrcode.react";
import styles from "../styles/QrGenerator.module.css";

// Debe ser removida en producción, solo por proposito de prueba
const TEST_URL = "http://facebook.github.io/react/";

const QrGenerator = ({ url, size = 250 }) => {

  return (
    <div className={`${styles.border}`}>
      <QRCode
        value={url || TEST_URL}
        size={size}
        includeMargin={true}
      />
    </div>
  )
};

export default QrGenerator;
