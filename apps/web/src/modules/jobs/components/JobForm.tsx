"use client";

import { useState, useEffect } from "react";
import { IJob } from "@/src/modules/jobs/interfaces/job.interface";
import { createJobAction, updateJobAction } from "@/src/modules/jobs/actions/job.actions";
import { useRouter } from "next/navigation";

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  job?: Partial<IJob>;
  onSuccess: (job: IJob, isNew: boolean) => void;
}

export default function JobForm({ isOpen, onClose, job = {}, onSuccess }: JobFormProps) {
  const [currentJob, setCurrentJob] = useState<Partial<IJob>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    setCurrentJob(job);
    setError("");
  }, [job, isOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validaciones básicas
      if (!currentJob.title || !currentJob.company || !currentJob.location || !currentJob.description) {
        setError("Por favor complete todos los campos requeridos");
        setLoading(false);
        return;
      }

      let savedJob;
      if (currentJob.id) {
        savedJob = await updateJobAction(currentJob.id, currentJob);
        onSuccess(savedJob, false);
      } else {
        savedJob = await createJobAction(currentJob);
        onSuccess(savedJob, true);
      }
      onClose();
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al guardar");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box max-w-2xl max-h-screen overflow-y-auto">
          <h3 className="font-bold text-xl mb-4">
            {currentJob.id ? "✏️ Editar Oferta" : "➕ Nueva Oferta"}
          </h3>

          {error && (
            <div className="alert alert-error mb-4">
              <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            {/* Título y Empresa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Título del Puesto *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Senior Developer"
                  className="input input-bordered w-full"
                  value={currentJob.title || ""}
                  onChange={(e) =>
                    setCurrentJob({ ...currentJob, title: e.target.value })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Empresa *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Tech Company Inc."
                  className="input input-bordered w-full"
                  value={currentJob.company || ""}
                  onChange={(e) =>
                    setCurrentJob({ ...currentJob, company: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Ubicación, Tipo y Nivel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Ubicación *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Madrid, España"
                  className="input input-bordered w-full"
                  value={currentJob.location || ""}
                  onChange={(e) =>
                    setCurrentJob({ ...currentJob, location: e.target.value })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Tipo de Contrato *</span>
                </label>
                <select
                  required
                  className="select select-bordered w-full"
                  value={currentJob.job_type || ""}
                  onChange={(e) =>
                    setCurrentJob({ ...currentJob, job_type: e.target.value as any })
                  }
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="full-time">Tiempo completo</option>
                  <option value="part-time">Medio tiempo</option>
                  <option value="contract">Contrato</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Nivel *</span>
                </label>
                <select
                  required
                  className="select select-bordered w-full"
                  value={currentJob.level || ""}
                  onChange={(e) =>
                    setCurrentJob({ ...currentJob, level: e.target.value as any })
                  }
                >
                  <option value="">Selecciona un nivel</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Semi-Senior</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                </select>
              </div>
            </div>

            {/* Salario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Salario Mínimo</span>
                </label>
                <input
                  type="number"
                  placeholder="ej. 30000"
                  className="input input-bordered w-full"
                  value={currentJob.salary_min || ""}
                  onChange={(e) =>
                    setCurrentJob({ ...currentJob, salary_min: parseInt(e.target.value) || undefined })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Salario Máximo</span>
                </label>
                <input
                  type="number"
                  placeholder="ej. 50000"
                  className="input input-bordered w-full"
                  value={currentJob.salary_max || ""}
                  onChange={(e) =>
                    setCurrentJob({ ...currentJob, salary_max: parseInt(e.target.value) || undefined })
                  }
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Descripción del Puesto *</span>
              </label>
              <textarea
                required
                placeholder="Descripción detallada de la oferta de empleo"
                className="textarea textarea-bordered w-full h-32"
                value={currentJob.description || ""}
                onChange={(e) =>
                  setCurrentJob({ ...currentJob, description: e.target.value })
                }
              />
            </div>



            {/* Permitir postularse públicamente */}
            <div className="form-control">
              <label className="cursor-pointer label">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={(currentJob as any).allow_public_apply !== false}
                  onChange={(e) =>
                    setCurrentJob({ ...currentJob, allow_public_apply: e.target.checked })
                  }
                />
                <span className="label-text font-medium ml-2">
                  Permitir postularse sin estar logeado
                </span>
              </label>
              <p className="text-sm text-base-content/60 ml-7">
                Si está habilitado, cualquier persona podrá aplicar a esta oferta sin necesidad de crear una cuenta
              </p>
            </div>

            {/* Botones */}
            <div className="modal-action">
              <button type="button" onClick={onClose} className="btn btn-ghost">
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </>
  );
}
