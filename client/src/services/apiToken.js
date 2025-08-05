const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const getToken = async () => {
  const res = await fetch(`${API_BASE_URL}/api/token`);
  if (!res.ok) throw new Error("Failed to get token");
  return res.json();
};
