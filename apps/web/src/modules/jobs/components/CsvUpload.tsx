"use client";

import { useState } from "react";
import { JobCsvService } from "@/src/modules/jobs/job-csv.service";

interface CsvUploadProps {
  onSuccess: (result: any) => void;
}

const IconUpload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const IconDownload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h5V5a1 1 0 011-1h2a1 1 0 011 1v4h5a1 1 0 110 2h-5v4a1 1 0 01-1 1h-2a1 1 0 01-1-1v-4H4a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

export default function CsvUpload({ onSuccess }: CsvUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith(".csv")) {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Por favor selecciona un archivo CSV válido");
      setFile(null);
    }
  };

  const handleDownloadTemplate = async () => {
    setLoading(true);
    try {
      await JobCsvService.downloadTemplate();
    } catch (err: any) {
      setError(err.message || "Error al descargar la plantilla");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCsv = async () => {
    setLoading(true);
    try {
      await JobCsvService.downloadCsv();
    } catch (err: any) {
      setError(err.message || "Error al descargar CSV");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Por favor selecciona un archivo");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await JobCsvService.uploadCsv(file);
      onSuccess(result);
      setIsOpen(false);
      setFile(null);
    } catch (err: any) {
      setError(err.message || "Error al subir el archivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={handleDownloadCsv}
          className="btn btn-sm btn-outline gap-2"
          disabled={loading}
          title="Descargar todas las ofertas en CSV"
        >
          <IconDownload />
          Descargar CSV
        </button>

        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-sm btn-outline gap-2"
          disabled={loading}
          title="Subir ofertas desde CSV"
        >
          <IconUpload />
          Subir CSV
        </button>
      </div>

      {isOpen && (
        <>
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Importar Ofertas desde CSV</h3>

              {error && (
                <div className="alert alert-error mb-4">
                  <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Selecciona un archivo CSV</span>
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="file-input file-input-bordered w-full"
                    disabled={loading}
                  />
                  {file && (
                    <label className="label">
                      <span className="label-text-alt text-success">✓ Archivo seleccionado: {file.name}</span>
                    </label>
                  )}
                </div>

                <div className="divider">o</div>

                <div>
                  <p className="text-sm text-base-content/70 mb-3">
                    ¿No tienes un archivo? Descarga la plantilla de ejemplo para ver el formato requerido:
                  </p>
                  <button
                    onClick={handleDownloadTemplate}
                    className="btn btn-sm btn-ghost w-full gap-2"
                    disabled={loading}
                  >
                    <IconDownload />
                    Descargar Plantilla
                  </button>
                </div>
              </div>

              <div className="modal-action">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setFile(null);
                    setError("");
                  }}
                  className="btn btn-ghost"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpload}
                  className="btn btn-primary"
                  disabled={!file || loading}
                >
                  {loading ? "Subiendo..." : "Importar"}
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setIsOpen(false)}></div>
        </>
      )}
    </>
  );
}
