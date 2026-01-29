"use client";

import { useState } from "react";
import { deleteJobAction } from "@/src/modules/jobs/actions/job.actions";
import { useRouter } from "next/navigation";

interface JobDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string | null;
  onSuccess: (id: string) => void;
}

export default function JobDeleteModal({ isOpen, onClose, jobId, onSuccess }: JobDeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    if (!jobId) return;

    setLoading(true);
    setError("");

    try {
      await deleteJobAction(jobId);
      onSuccess(jobId);
      onClose();
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al eliminar");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Eliminar Oferta de Empleo</h3>
          <p className="py-4">
            ¿Estás seguro de que deseas eliminar esta oferta de empleo? Esta acción no se puede deshacer.
          </p>

          {error && (
            <div className="alert alert-error mb-4">
              <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="modal-action">
            <button onClick={onClose} className="btn btn-ghost" disabled={loading}>
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-error"
              disabled={loading}
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </>
  );
}
