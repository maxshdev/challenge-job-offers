"use client";

import { useState } from "react";
import { IJobApplication } from "@/src/modules/job-applications/interfaces/job-application.interface";
import {
  updateApplicationStatusAction,
  resendNotificationAction,
  deleteApplicationAction,
} from "../actions/job-application.actions";
import Toast from "@/src/components/Toast";

interface JobApplicationTableProps {
  initialApplications: IJobApplication[];
}

const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const IconEye = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
  </svg>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case "accepted":
      return "badge-success";
    case "rejected":
      return "badge-error";
    case "reviewed":
      return "badge-info";
    default:
      return "badge-warning";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "reviewed":
      return "Revisada";
    case "accepted":
      return "Aceptada";
    case "rejected":
      return "Rechazada";
    default:
      return status;
  }
};

export default function JobApplicationTable({
  initialApplications,
}: JobApplicationTableProps) {
  const [applications, setApplications] =
    useState<IJobApplication[]>(initialApplications);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const closeToast = () => {
    setToast(null);
  };

  const handleStatusChange = async (
    app: IJobApplication,
    newStatus: string
  ) => {
    setLoading(true);
    try {
      await updateApplicationStatusAction(app.job_id, app.id, newStatus);
      setApplications(
        applications.map((a) =>
          a.id === app.id ? { ...a, status: newStatus as any } : a
        )
      );
      setToast({
        message: "Estado actualizado correctamente",
        type: "success",
      });
    } catch (error: any) {
      setToast({
        message: error.message || "Error al actualizar el estado",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendNotification = async (app: IJobApplication) => {
    setLoading(true);
    try {
      await resendNotificationAction(app.job_id, app.id);
      setToast({
        message: "Notificación reenviada correctamente",
        type: "success",
      });
    } catch (error: any) {
      setToast({
        message: error.message || "Error al reenviar la notificación",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (app: IJobApplication) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta aplicación?")) {
      setLoading(true);
      try {
        await deleteApplicationAction(app.job_id, app.id);
        setApplications(applications.filter((a) => a.id !== app.id));
        setToast({
          message: "Aplicación eliminada correctamente",
          type: "success",
        });
      } catch (error: any) {
        setToast({
          message: error.message || "Error al eliminar la aplicación",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">Aplicaciones Recibidas</h2>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-base-300">
                  <th className="text-left">Email</th>
                  <th className="text-left">Puesto</th>
                  <th className="text-left">Empresa</th>
                  <th className="text-center">Estado</th>
                  <th className="text-left">Fecha</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-base-content/60">
                      No hay aplicaciones registradas
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="border-b border-base-200 hover:bg-base-200/50">
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-8">
                              <span className="text-xs font-bold">
                                {app.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <span className="font-medium">{app.email}</span>
                        </div>
                      </td>
                      <td>{app.job?.title || "N/A"}</td>
                      <td>{app.job?.company || "N/A"}</td>
                      <td className="text-center">
                        <select
                          className="select select-sm select-bordered w-32"
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(app, e.target.value)
                          }
                          disabled={loading}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="reviewed">Revisada</option>
                          <option value="accepted">Aceptada</option>
                          <option value="rejected">Rechazada</option>
                        </select>
                      </td>
                      <td className="text-sm text-base-content/70">
                        {new Date(app.created_at).toLocaleDateString("es-ES")}
                      </td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleResendNotification(app)}
                            className="btn btn-sm btn-ghost"
                            title="Reenviar notificación"
                            disabled={loading}
                          >
                            <IconMail />
                          </button>
                          <button
                            onClick={() => handleDelete(app)}
                            className="btn btn-sm btn-ghost text-error"
                            title="Eliminar"
                            disabled={loading}
                          >
                            <IconX />
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

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
        />
      )}
    </>
  );
}
