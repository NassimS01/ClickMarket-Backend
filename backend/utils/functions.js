export const getRandomProducts = (prodsArray, n) => {
  if (Array.isArray(prodsArray)) {
    const copyProdsArray = [...prodsArray];
    return copyProdsArray.sort(() => 0.5 - Math.random()).slice(0, n);
  } else {
    console.error("prodsArray is not a valid array.");
    return []; // O manejo de error adecuado
  }
};

export const getDiscount = (price, discount) => {
  return (price + (price * discount) / 100).toFixed();
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat("es-Ar", {
    style: "currency",
    currency: "ARS",
  }).format(price);
};
