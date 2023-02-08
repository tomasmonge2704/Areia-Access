export const dateToString = (date, exp) => {
  const newDate = new Date(date);
  const dateOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  if (exp) {
    const expiration = new Date(newDate.getTime() + 60 * 60 * 48 * 1000);
    return expiration.toLocaleDateString("es-ES", dateOptions);
  }

  return newDate.toLocaleDateString("es-ES", dateOptions);
};

export const isMobile = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

