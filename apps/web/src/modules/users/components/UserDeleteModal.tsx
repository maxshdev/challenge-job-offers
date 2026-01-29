"use client";

import { useState } from "react";
import { deleteUserAction } from "@/src/modules/users/actions/user.actions";
import { useRouter } from "next/navigation";

interface UserDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | null;
    onSuccess: (id: string) => void;
}

const IconWarning = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

export default function UserDeleteModal({ isOpen, onClose, userId, onSuccess }: UserDeleteModalProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const confirmDelete = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            await deleteUserAction(userId);
            onSuccess(userId);
            onClose();
            router.refresh();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal modal-open">
                <div className="modal-box">
                    <div className="flex flex-col items-center text-center">
                        <div className="text-error mb-4">
                            <IconWarning />
                        </div>
                        <h3 className="font-bold text-xl mb-2">¿Eliminar Usuario?</h3>
                        <p className="text-base-content/70 mb-6">
                            Esta acción no se puede deshacer. El usuario será eliminado permanentemente del sistema.
                        </p>
                    </div>
                    <div className="modal-action justify-center">
                        <button
                            className="btn btn-ghost"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            className="btn btn-error"
                            onClick={confirmDelete}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Eliminando...
                                </>
                            ) : (
                                <>
                                    <IconTrash />
                                    Eliminar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop bg-black/50" onClick={() => !loading && onClose()}></div>
        </>
    );
}
