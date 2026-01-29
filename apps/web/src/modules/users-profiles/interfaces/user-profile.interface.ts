import { IUser } from '@/src/modules/users/interfaces/user.interface';

export interface IUserProfile {
  id: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  title?: string;
  biography?: string;
  website?: string;
  social_links?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
    x?: string;
    youtube?: string;
    [key: string]: string | undefined;
  };
  user?: IUser;
  created_at?: string;
  updated_at?: string;
}