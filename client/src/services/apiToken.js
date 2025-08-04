export const getToken = async () => {
  const res = await fetch("/api/token");
  if (!res.ok) throw new Error("Failed to get token");
  return res.json();
};
  