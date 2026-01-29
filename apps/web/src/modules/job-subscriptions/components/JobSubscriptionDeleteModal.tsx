"use client";

import { useState } from "react";
import { deleteJobSubscriptionAction } from "@/src/modules/job-subscriptions/actions/job-subscription.actions";
import { useRouter } from "next/navigation";

interface JobSubscriptionDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    subscriptionId: string | null;
    onSuccess: (id: string) => void;
}

export default function JobSubscriptionDeleteModal({ isOpen, onClose, subscriptionId, onSuccess }: JobSubscriptionDeleteModalProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!subscriptionId) return;
        setLoading(true);

        try {
            await deleteJobSubscriptionAction(subscriptionId);
            onSuccess(subscriptionId);
            onClose();
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal modal-open">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-error">Eliminar Suscripción</h3>
                    <p className="py-4">¿Estás seguro de que deseas eliminar esta suscripción? Esta acción no se puede deshacer.</p>
                    <div className="modal-action">
                        <button onClick={onClose} className="btn btn-ghost">Cancelar</button>
                        <button onClick={handleDelete} className="btn btn-error" disabled={loading}>
                            {loading ? "Eliminando..." : "Eliminar"}
                        </button>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </>
    );
}
