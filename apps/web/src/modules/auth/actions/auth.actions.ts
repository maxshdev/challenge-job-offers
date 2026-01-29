import { AuthService } from "../auth.service";

export const loginAction = (email: string, password: string) => AuthService.login({ email, password });
export const registerAction = (email: string, password: string) => AuthService.register({ email, password });