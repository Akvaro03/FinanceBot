function formatMoney(value: number) {
  console.log(value)
  if (typeof value !== "number" || isNaN(value)) {
    return "0";
  }
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });
}

export default formatMoney;
