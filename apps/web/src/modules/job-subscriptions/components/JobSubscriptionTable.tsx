"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IJobSubscription } from "@/src/modules/job-subscriptions/interfaces/job-subscription.interface";
import JobSubscriptionForm from "./JobSubscriptionForm";
import JobSubscriptionDeleteModal from "./JobSubscriptionDeleteModal";
import Toast from "@/src/components/Toast";

interface JobSubscriptionTableProps {
    initialSubscriptions: IJobSubscription[];
}

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

const IconBell = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
);

export default function JobSubscriptionTable({ initialSubscriptions }: JobSubscriptionTableProps) {
    const [subscriptions, setSubscriptions] = useState<IJobSubscription[]>(initialSubscriptions);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentSubscription, setCurrentSubscription] = useState<Partial<IJobSubscription>>({});
    const [subscriptionToDelete, setSubscriptionToDelete] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleEdit = (sub: IJobSubscription) => {
        setCurrentSubscription(sub);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setCurrentSubscription({});
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setSubscriptionToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleSuccess = (savedSub: IJobSubscription, isNew: boolean) => {
        if (isNew) {
            setSubscriptions([savedSub, ...subscriptions]);
            setToast({ message: "Suscripción creada exitosamente", type: "success" });
        } else {
            setSubscriptions(subscriptions.map((s) => (s.id === savedSub.id ? savedSub : s)));
            setToast({ message: "Suscripción actualizada exitosamente", type: "success" });
        }
    };

    const handleDeleteSuccess = (id: string) => {
        setSubscriptions(subscriptions.filter((s) => s.id !== id));
        setToast({ message: "Suscripción eliminada exitosamente", type: "success" });
    };

    return (
        <div className="w-full">
            <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="card-title text-2xl">
                                <IconBell />
                                Suscripciones de Empleo
                            </h2>
                            <p className="text-base-content/60 mt-1">
                                {subscriptions.length} {subscriptions.length === 1 ? "suscripción registrada" : "suscripciones registradas"}
                            </p>
                        </div>
                        <button className="btn btn-primary gap-2" onClick={handleCreate}>
                            <IconPlus />
                            Nueva Suscripción
                        </button>
                    </div>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Palabras Clave</th>
                                    <th>Criterios</th>
                                    <th>Estado</th>
                                    <th>Fecha Creación</th>
                                    <th className="text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscriptions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-base-content/60">
                                            No hay suscripciones registradas
                                        </td>
                                    </tr>
                                ) : (
                                    subscriptions.map((sub) => (
                                        <tr key={sub.id} className="hover">
                                            <td className="font-medium">{sub.email}</td>
                                            <td>
                                                {sub.search_pattern ? (
                                                    <div className="badge badge-neutral">{sub.search_pattern}</div>
                                                ) : (
                                                    <span className="opacity-50 text-xs italic">Cualquiera</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="flex flex-col gap-1 text-xs">
                                                    {sub.job_type && <div>Tipo: <span className="font-semibold">{sub.job_type}</span></div>}
                                                    {sub.level && <div>Nivel: <span className="font-semibold">{sub.level}</span></div>}
                                                    {sub.location && <div>Ubicación: <span className="font-semibold">{sub.location}</span></div>}
                                                    {(sub.salary_min || sub.salary_max) && (
                                                        <div>Salario: <span className="font-semibold">{sub.salary_min || 0} - {sub.salary_max || '∞'}</span></div>
                                                    )}
                                                    {(!sub.job_type && !sub.level && !sub.location && !sub.salary_min && !sub.salary_max) &&
                                                        <span className="opacity-50 italic">Sin filtros adicionales</span>
                                                    }
                                                </div>
                                            </td>
                                            <td>
                                                {sub.is_active ? (
                                                    <div className="badge badge-success badge-sm">Activo</div>
                                                ) : (
                                                    <div className="badge badge-ghost badge-sm">Inactivo</div>
                                                )}
                                            </td>
                                            <td className="text-sm">
                                                {new Date(sub.created_at).toLocaleDateString("es-ES", {
                                                    year: "numeric", month: "short", day: "numeric"
                                                })}
                                            </td>
                                            <td>
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleEdit(sub)} className="btn btn-sm btn-ghost" title="Editar">
                                                        <IconEdit />
                                                    </button>
                                                    <button onClick={() => handleDeleteClick(sub.id)} className="btn btn-sm btn-ghost text-error" title="Eliminar">
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

            <JobSubscriptionForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                subscription={currentSubscription}
                onSuccess={handleSuccess}
            />

            <JobSubscriptionDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSubscriptionToDelete(null);
                }}
                subscriptionId={subscriptionToDelete}
                onSuccess={handleDeleteSuccess}
            />

            {toast && <Toast message={toast.message} type={toast.type} />}
        </div>
    );
}
