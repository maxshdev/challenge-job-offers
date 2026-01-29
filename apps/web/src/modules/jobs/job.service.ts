const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Ocurrió un error");
  }
  return res.json();
}

export const JobService = {
  getAll: async (filters?: any) => {
    let url = `${API_URL}/jobs`;
    if (filters) {
      const query = new URLSearchParams(filters).toString();
      url += `?${query}`;
    }
    const res = await fetch(url);
    const response = await handleResponse(res);
    return response;
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_URL}/jobs/${id}`);
    return handleResponse(res);
  },

  create: async (data: any) => {
    const res = await fetch(`${API_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  update: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_URL}/jobs/${id}`, { method: "DELETE" });
    return handleResponse(res);
  },

  apply: async (jobId: string, data: any) => {
    const res = await fetch(`${API_URL}/jobs/${jobId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
};
