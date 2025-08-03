export const getToken = async () => {
  const res = await fetch(
    "https://frontend-test-assignment-api.abz.agency/api/v1/token"
  );
  if (!res.ok) throw new Error("Failed to get token");
  return res.json();
};
