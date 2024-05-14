import { RWebShare } from "react-web-share";
import { isMobile } from "../helpers";
import styles from "../styles/MainButton.module.css";

const ENABLED_SITES = ["copy", "whatsapp", "mail", "telegram"];

const MainButton = ({ onClick, text, secondary, buttonStyle, disabled,style }) => (
  <button
    className={`${styles.button} ${
      secondary && styles.secondary
    } ${buttonStyle}`}
    onClick={onClick}
    disabled={disabled}
    style={style}
  >
    {text}
  </button>
);
export default MainButton;

export const InviteButton = ({
  onClick,
  text,
  secondary,
  url,
  title,
  description,
  children,
  buttonStyle,
  validated,
  shared,
  onShare,
}) => {
  const BasicButton = () => (
    <button
      className={`${styles.button} ${
        secondary && styles.secondary
      } ${buttonStyle}`}
      onClick={onClick}
    >
      <p className={styles.text}>{text}</p>
      {children}
    </button>
  );

  if (validated || (shared && isMobile())) {
    return <BasicButton />;
  }

  return (
    <RWebShare
      data={{
        text: description,
        url,
        title,
      }}
      sites={ENABLED_SITES}
      onClick={onShare}
    >
      <button
        className={`${styles.button} ${
          secondary && styles.secondary
        } ${buttonStyle}`}
      >
        <p className={styles.text}>{text}</p>
        {children}
      </button>
    </RWebShare>
  );
};
