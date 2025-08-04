export const getUsers = async (page = 1, count = 6) => {
  const res = await fetch(`/api/users?page=${page}&count=${count}`);
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  return await res.json();
};

export const postUser = async (formData, token) => {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: {
      Token: token,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Request failed with status ${res.status}: ${errorText}`);
  }

  return await res.json();
};