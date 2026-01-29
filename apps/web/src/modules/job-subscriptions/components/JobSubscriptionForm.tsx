"use client";

import { useState, useEffect } from "react";
import { IJobSubscription } from "@/src/modules/job-subscriptions/interfaces/job-subscription.interface";
import { createJobSubscriptionAction, updateJobSubscriptionAction } from "@/src/modules/job-subscriptions/actions/job-subscription.actions";
import { useRouter } from "next/navigation";

interface JobSubscriptionFormProps {
    isOpen: boolean;
    onClose: () => void;
    subscription?: Partial<IJobSubscription>;
    onSuccess: (subscription: IJobSubscription, isNew: boolean) => void;
}

export default function JobSubscriptionForm({ isOpen, onClose, subscription = {}, onSuccess }: JobSubscriptionFormProps) {
    const [currentSubscription, setCurrentSubscription] = useState<Partial<IJobSubscription>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        setCurrentSubscription(subscription);
        setError("");
    }, [subscription, isOpen]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!currentSubscription.email) {
                setError("El email es requerido");
                setLoading(false);
                return;
            }

            const payload = { ...currentSubscription };
            // Clean up empty optional fields
            if (!payload.job_type) delete payload.job_type;
            if (!payload.level) delete payload.level;
            if (!payload.search_pattern) delete payload.search_pattern;
            if (!payload.location) delete payload.location;

            let savedSubscription;
            if (currentSubscription.id) {
                savedSubscription = await updateJobSubscriptionAction(currentSubscription.id, payload);
                onSuccess(savedSubscription, false);
            } else {
                savedSubscription = await createJobSubscriptionAction(payload);
                onSuccess(savedSubscription, true);
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
                <div className="modal-box">
                    <h3 className="font-bold text-xl mb-4">
                        {currentSubscription.id ? "✏️ Editar Suscripción" : "➕ Nueva Suscripción"}
                    </h3>

                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email *</span>
                            </label>
                            <input
                                type="email"
                                required
                                className="input input-bordered w-full"
                                value={currentSubscription.email || ""}
                                onChange={(e) => setCurrentSubscription({ ...currentSubscription, email: e.target.value })}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Palabras clave</span>
                            </label>
                            <input
                                type="text"
                                placeholder="ej. React, Node.js"
                                className="input input-bordered w-full"
                                value={currentSubscription.search_pattern || ""}
                                onChange={(e) => setCurrentSubscription({ ...currentSubscription, search_pattern: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Tipo</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={currentSubscription.job_type || ""}
                                    onChange={(e) => setCurrentSubscription({ ...currentSubscription, job_type: e.target.value })}
                                >
                                    <option value="">Cualquiera</option>
                                    <option value="full-time">Tiempo completo</option>
                                    <option value="part-time">Medio tiempo</option>
                                    <option value="contract">Contrato</option>
                                    <option value="freelance">Freelance</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Nivel</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={currentSubscription.level || ""}
                                    onChange={(e) => setCurrentSubscription({ ...currentSubscription, level: e.target.value })}
                                >
                                    <option value="">Cualquiera</option>
                                    <option value="junior">Junior</option>
                                    <option value="mid">Semi-Senior</option>
                                    <option value="senior">Senior</option>
                                    <option value="lead">Lead</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Ubicación</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={currentSubscription.location || ""}
                                onChange={(e) => setCurrentSubscription({ ...currentSubscription, location: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Salario Min</span>
                                </label>
                                <input
                                    type="number"
                                    className="input input-bordered w-full"
                                    value={currentSubscription.salary_min || ""}
                                    onChange={(e) => setCurrentSubscription({ ...currentSubscription, salary_min: Number(e.target.value) || undefined })}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Salario Max</span>
                                </label>
                                <input
                                    type="number"
                                    className="input input-bordered w-full"
                                    value={currentSubscription.salary_max || ""}
                                    onChange={(e) => setCurrentSubscription({ ...currentSubscription, salary_max: Number(e.target.value) || undefined })}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="cursor-pointer label justify-start gap-4">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary"
                                    checked={currentSubscription.is_active !== false}
                                    onChange={(e) => setCurrentSubscription({ ...currentSubscription, is_active: e.target.checked })}
                                />
                                <span className="label-text font-medium">Activo</span>
                            </label>
                        </div>

                        <div className="modal-action">
                            <button type="button" onClick={onClose} className="btn btn-ghost">Cancelar</button>
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
