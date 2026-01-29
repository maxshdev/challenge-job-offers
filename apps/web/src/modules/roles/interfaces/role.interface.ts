export interface IRole {
  id: string;            
  name: string;          // ej: 'superadmin', 'admin', 'user', 'guest'
  created_at?: string;   
  updated_at?: string;
}