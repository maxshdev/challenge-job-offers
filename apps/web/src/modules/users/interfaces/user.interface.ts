import { IRole } from '@/src/modules/roles/interfaces/role.interface';
import { IUserProfile } from '@/src/modules/users-profiles/interfaces/user-profile.interface';

export interface IUser {
  id: string;                  // heredado de BaseEntity (supongo que tiene id, created_at, updated_at)
  email: string;
  password: string;           // opcional para no exponerlo siempre
  role: IRole;
  profile: IUserProfile;
  created_at: string;         // fechas opcionales si vienen del backend como ISO strings
  updated_at: string;
}
