import { UserService } from "../user.service";

export const getUsersAction = () => UserService.getAll();
export const getUserByIdAction = (id: string) => UserService.getById(id);
export const createUserAction = (data: any) => UserService.create(data);
export const updateUserAction = (id: string, data: any) => UserService.update(id, data);
export const deleteUserAction = (id: string) => UserService.delete(id);
export const getRolesAction = () => UserService.getRoles();
