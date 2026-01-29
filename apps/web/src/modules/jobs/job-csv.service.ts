const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Ocurrió un error");
  }
  return res.json();
}

export const JobCsvService = {
  // Descargar ofertas en formato CSV
  downloadCsv: async () => {
    const res = await fetch(`${API_URL}/jobs/export/csv`);
    if (!res.ok) {
      throw new Error("Error al descargar CSV");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ofertas-empleo-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Descargar plantilla CSV
  downloadTemplate: async () => {
    const res = await fetch(`${API_URL}/jobs/template/csv`);
    if (!res.ok) {
      throw new Error("Error al descargar plantilla");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "template-ofertas.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Subir archivo CSV
  uploadCsv: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/jobs/import/csv`, {
      method: "POST",
      body: formData,
    });

    return handleResponse(res);
  },
};
