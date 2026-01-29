"use client";

import { useState, useEffect } from "react";
import { IUser } from "@/src/modules/users/interfaces/user.interface";
import { IRole } from "@/src/modules/roles/interfaces/role.interface";
import { createUserAction, updateUserAction } from "@/src/modules/users/actions/user.actions";
import { useRouter } from "next/navigation";

interface UserFormProps {
    isOpen: boolean;
    onClose: () => void;
    user?: Partial<IUser>;
    roles: IRole[];
    onSuccess: (user: IUser, isNew: boolean) => void;
}

export default function UserForm({ isOpen, onClose, user = {}, roles, onSuccess }: UserFormProps) {
    const [currentUser, setCurrentUser] = useState<Partial<IUser>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        setCurrentUser(user);
        setError("");
    }, [user, isOpen]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let savedUser;
            if (currentUser.id) {
                savedUser = await updateUserAction(currentUser.id, currentUser);
                onSuccess(savedUser, false);
            } else {
                savedUser = await createUserAction(currentUser);
                onSuccess(savedUser, true);
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
                <div className="modal-box max-w-md">
                    <h3 className="font-bold text-xl mb-4">
                        {currentUser.id ? "✏️ Editar Usuario" : "➕ Nuevo Usuario"}
                    </h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Correo Electrónico</span>
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="usuario@ejemplo.com"
                                className="input input-bordered w-full"
                                value={currentUser.email || ""}
                                onChange={(e) =>
                                    setCurrentUser({ ...currentUser, email: e.target.value })
                                }
                            />
                        </div>

                        {!currentUser.id && (
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Contraseña</span>
                                </label>
                                <input
                                    type="password"
                                    required={!currentUser.id}
                                    placeholder="••••••••"
                                    className="input input-bordered w-full"
                                    value={currentUser.password || ""}
                                    onChange={(e) =>
                                        setCurrentUser({ ...currentUser, password: e.target.value })
                                    }
                                />
                                <label className="label">
                                    <span className="label-text-alt">Mínimo 8 caracteres</span>
                                </label>
                            </div>
                        )}

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Rol de Usuario</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={currentUser.role?.id || ""}
                                required
                                onChange={(e) => {
                                    const selectedRole = roles.find((r) => r.id === e.target.value);
                                    if (selectedRole) {
                                        setCurrentUser({ ...currentUser, role: selectedRole });
                                    }
                                }}
                            >
                                <option value="" disabled>
                                    Seleccionar rol
                                </option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {error && (
                            <div className="alert alert-error">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Guardando...
                                    </>
                                ) : (
                                    "Guardar"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="modal-backdrop bg-black/50" onClick={() => !loading && onClose()}></div>
        </>
    );
}
