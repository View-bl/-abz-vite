export const getPositions = async () => {
  const res = await fetch("/api/v1/positions"); 
  if (!res.ok) throw new Error("Failed to fetch positions");
  return res.json();
};
