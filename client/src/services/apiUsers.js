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
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      errorData = null;
    }

    if (errorData && errorData.message) {
      throw new Error(errorData.message);
    } else {
      throw new Error(`Request failed with status ${res.status}`);
    }
  }

  return await res.json();
};

