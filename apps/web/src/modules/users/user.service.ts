const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Ocurrió un error");
  }
  return res.json();
}

export const UserService = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/users`);
    return handleResponse(res);
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_URL}/users/${id}`);
    return handleResponse(res);
  },

  create: async (data: any) => {
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  update: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
    return handleResponse(res);
  },

  getRoles: async () => {
    const res = await fetch(`${API_URL}/roles`);
    return handleResponse(res);
  },
};
