const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function handleResponse(res: Response) {
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Ocurrió un error");
    }
    return res.json();
}

export const JobSubscriptionService = {
    getAll: async () => {
        const res = await fetch(`${API_URL}/job-alerts`);
        return handleResponse(res);
    },

    getById: async (id: string) => {
        const res = await fetch(`${API_URL}/job-alerts/${id}`);
        return handleResponse(res);
    },

    create: async (data: any) => {
        const res = await fetch(`${API_URL}/job-alerts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    update: async (id: string, data: any) => {
        const res = await fetch(`${API_URL}/job-alerts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    delete: async (id: string) => {
        const res = await fetch(`${API_URL}/job-alerts/${id}`, { method: "DELETE" });
        return handleResponse(res);
    },
};
