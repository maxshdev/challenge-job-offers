const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Ocurrió un error");
  }
  return res.json();
}

export const UserProfileService = {
  getById: async (id: string) => {
    const res = await fetch(`${API_URL}/users/${id}/profile`);
    return handleResponse(res);
  },

  update: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/users/${id}/profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
};
