"use client";

import { useState } from "react";
import { IUser } from "@/src/modules/users/interfaces/user.interface";
import { IRole } from "@/src/modules/roles/interfaces/role.interface";
import UserForm from "./UserForm";
import UserDeleteModal from "./UserDeleteModal";

interface UserTableProps {
    initialUsers: IUser[];
    roles: IRole[];
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

const IconUser = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

export default function UserTable({ initialUsers, roles }: UserTableProps) {
    const [users, setUsers] = useState<IUser[]>(initialUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<Partial<IUser>>({});
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const getRoleBadgeColor = (roleName: string) => {
        const colors: Record<string, string> = {
            SuperAdmin: "badge-error",
            ClientAdmin: "badge-warning",
            Manager: "badge-info",
            Subscriber: "badge-success",
            Guest: "badge-ghost",
        };
        return colors[roleName] || "badge-neutral";
    };

    const handleEdit = (user: IUser) => {
        setCurrentUser(user);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setCurrentUser({});
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setUserToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleSuccess = (savedUser: IUser, isNew: boolean) => {
        if (isNew) {
            setUsers([savedUser, ...users]);
        } else {
            setUsers(users.map((u) => (u.id === savedUser.id ? savedUser : u)));
        }
    };

    const handleDeleteSuccess = (id: string) => {
        setUsers(users.filter((u) => u.id !== id));
    };

    return (
        <div className="w-full">
            {/* Header Card */}
            <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="card-title text-2xl">
                                <IconUser />
                                Gestión de Usuarios
                            </h2>
                            <p className="text-base-content/60 mt-1">
                                {users.length} {users.length === 1 ? "usuario registrado" : "usuarios registrados"}
                            </p>
                        </div>
                        <button className="btn btn-primary gap-2" onClick={handleCreate}>
                            <IconPlus />
                            Nuevo Usuario
                        </button>
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
                                    <th>Usuario</th>
                                    <th>Rol</th>
                                    <th>Fecha de Registro</th>
                                    <th className="text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-base-content/60">
                                            No hay usuarios registrados
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover">
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar placeholder">
                                                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                            <span className="text-sm">{user.email.charAt(0).toUpperCase()}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{user.email}</div>
                                                        <div className="text-sm opacity-50">ID: {user.id.slice(0, 8)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${getRoleBadgeColor(user.role?.name)} badge-lg`}>
                                                    {user.role?.name}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="text-sm">
                                                    {new Date(user.created_at).toLocaleDateString("es-ES", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </div>
                                                <div className="text-xs opacity-50">
                                                    {new Date(user.created_at).toLocaleTimeString("es-ES", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        className="btn btn-sm btn-ghost gap-1"
                                                        onClick={() => handleEdit(user)}
                                                    >
                                                        <IconEdit />
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-error btn-outline gap-1"
                                                        onClick={() => handleDeleteClick(user.id)}
                                                    >
                                                        <IconTrash />
                                                        Eliminar
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

            <UserForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={currentUser}
                roles={roles}
                onSuccess={handleSuccess}
            />

            <UserDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                userId={userToDelete}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    );
}
