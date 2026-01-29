// src/modules/users/hooks/useUsers.ts
import { useState, useEffect } from "react";
import { UserService } from "../user.service";
import { IUser } from "../interfaces/user.interface";

export function useUsers(initialData: IUser[] = []) {
  const [users, setUsers] = useState<IUser[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await UserService.getAll();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  const addUser = (user: IUser) => setUsers([user, ...users]);
  const updateUser = (updated: IUser) =>
    setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
  const removeUser = (id: string) => setUsers(users.filter((u) => u.id !== id));

  useEffect(() => {
    if (!initialData.length) fetchUsers();
  }, []);

  return { users, loading, error, fetchUsers, addUser, updateUser, removeUser };
}
