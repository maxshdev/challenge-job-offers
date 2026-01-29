const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Ocurrió un error");
  }
  return res.json();
}

export const JobApplicationService = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/job-applications`, {
      cache: "no-store",
    });
    return handleResponse(res);
  },

  getByJobId: async (jobId: string) => {
    const res = await fetch(`${API_URL}/jobs/${jobId}/applications`, {
      cache: "no-store",
    });
    return handleResponse(res);
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_URL}/job-applications/${id}`, {
      cache: "no-store",
    });
    return handleResponse(res);
  },

  updateStatus: async (
    jobId: string,
    applicationId: string,
    status: string
  ) => {
    const res = await fetch(
      `${API_URL}/jobs/${jobId}/applications/${applicationId}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );
    return handleResponse(res);
  },

  resendNotification: async (jobId: string, applicationId: string, token?: string) => {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(
      `${API_URL}/jobs/${jobId}/applications/${applicationId}/resend-notification`,
      {
        method: "POST",
        headers,
      }
    );
    return handleResponse(res);
  },

  delete: async (jobId: string, applicationId: string) => {
    const res = await fetch(
      `${API_URL}/jobs/${jobId}/applications/${applicationId}`,
      { method: "DELETE" }
    );
    return handleResponse(res);
  },
};
