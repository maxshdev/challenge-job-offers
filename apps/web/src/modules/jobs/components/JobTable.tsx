"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IJob } from "@/src/modules/jobs/interfaces/job.interface";
import JobForm from "@/src/modules/jobs/components/JobForm";
import JobDeleteModal from "@/src/modules/jobs/components/JobDeleteModal";
import CsvUpload from "@/src/modules/jobs/components/CsvUpload";
import Toast from "@/src/components/Toast";

interface JobTableProps {
  initialJobs: IJob[];
}

// Iconos SVG
const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const IconBriefcase = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    "full-time": "badge-info",
    "part-time": "badge-warning",
    contract: "badge-success",
    freelance: "badge-secondary",
  };
  return colors[type] || "badge-neutral";
};

const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    junior: "badge-success",
    mid: "badge-info",
    senior: "badge-warning",
    lead: "badge-error",
  };
  return colors[level] || "badge-neutral";
};

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    "full-time": "Tiempo completo",
    "part-time": "Medio tiempo",
    contract: "Contrato",
    freelance: "Freelance",
  };
  return labels[type] || type;
};

const getLevelLabel = (level: string) => {
  const labels: Record<string, string> = {
    junior: "Junior",
    mid: "Semi-Senior",
    senior: "Senior",
    lead: "Lead",
  };
  return labels[level] || level;
};

export default function JobTable({ initialJobs }: JobTableProps) {
  const [jobs, setJobs] = useState<IJob[]>(initialJobs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<Partial<IJob>>({});
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleEdit = (job: IJob) => {
    setCurrentJob(job);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentJob({});
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setJobToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleSuccess = (savedJob: IJob, isNew: boolean) => {
    if (isNew) {
      setJobs([savedJob, ...jobs]);
    } else {
      setJobs(jobs.map((j) => (j.id === savedJob.id ? savedJob : j)));
    }
  };

  const handleDeleteSuccess = (id: string) => {
    setJobs(jobs.filter((j) => j.id !== id));
  };

  const handleCsvUploadSuccess = (result: any) => {
    if (result.created > 0) {
      setToast({
        message: `${result.created} oferta(s) importada(s) exitosamente`,
        type: "success",
      });
      router.refresh();
    }
    if (result.errors && result.errors.length > 0) {
      setToast({
        message: `Se importaron ${result.created} ofertas. ${result.errors.length} errores: ${result.errors[0]}`,
        type: "error",
      });
    }
  };

  return (
    <div className="w-full">
      {/* Header Card */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="card-title text-2xl">
                  <IconBriefcase />
                  Gestión de Ofertas de Empleo
                </h2>
                <p className="text-base-content/60 mt-1">
                  {jobs.length} {jobs.length === 1 ? "oferta registrada" : "ofertas registradas"}
                </p>
              </div>
              <button className="btn btn-primary gap-2" onClick={handleCreate}>
                <IconPlus />
                Nueva Oferta
              </button>
            </div>

            {/* CSV Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <CsvUpload onSuccess={handleCsvUploadSuccess} />
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Puesto</th>
                  <th>Empresa</th>
                  <th>Ubicación</th>
                  <th>Tipo</th>
                  <th>Nivel</th>
                  <th>Salario</th>
                  <th>Fecha de Creación</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-base-content/60">
                      No hay ofertas de empleo registradas
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="hover">
                      <td>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm opacity-50">ID: {job.id.slice(0, 8)}...</div>
                      </td>
                      <td>{job.company}</td>
                      <td>{job.location}</td>
                      <td>
                        <span className={`badge ${getTypeColor(job.job_type)} badge-sm`}>
                          {getTypeLabel(job.job_type)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getLevelColor(job.level || 'junior')} badge-sm`}>
                          {getLevelLabel(job.level || 'junior')}
                        </span>
                      </td>
                      <td>
                        {job.salary_min && job.salary_max ? (
                          <div className="text-sm">
                            ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                          </div>
                        ) : (
                          <span className="text-base-content/50">N/A</span>
                        )}
                      </td>
                      <td>
                        <div className="text-sm">
                          {new Date(job.created_at).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(job)}
                            className="btn btn-sm btn-ghost"
                            title="Editar"
                          >
                            <IconEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(job.id)}
                            className="btn btn-sm btn-ghost text-error"
                            title="Eliminar"
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <JobForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={currentJob}
        onSuccess={handleSuccess}
      />

      <JobDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setJobToDelete(null);
        }}
        jobId={jobToDelete}
        onSuccess={handleDeleteSuccess}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
        />
      )}
    </div>
  );
}
