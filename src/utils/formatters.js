export const formatPrice = (amount) => {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
};
