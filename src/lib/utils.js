export { cn } from "cn";

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "PKR 0";
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatPercentage = (totalBudget, totalSpent) => {
  const rawPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const spentPercentage = Math.min(rawPercentage, 100);

  return spentPercentage < 1 && spentPercentage > 0
    ? spentPercentage.toFixed(2)
    : Math.round(spentPercentage);
};

export const formatDateForInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

export const getDefaultDates = () => {
  const today = new Date();
  const pastMonth = new Date();
  pastMonth.setDate(today.getDate() - 30);

  return {
    startDate: formatDateForInput(pastMonth),
    endDate: formatDateForInput(today),
  };
};
