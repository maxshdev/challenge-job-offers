export interface IAuth {
  id: string;                  // heredado de BaseEntity (supongo que tiene id, created_at, updated_at)
  email: string;
  password: string;           // opcional para no exponerlo siempre
  role: string;
  created_at: string;         // fechas opcionales si vienen del backend como ISO strings
  updated_at: string;
}
