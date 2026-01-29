import { IsEmail, IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

/**
 * DTO para crear una suscripción a alertas de empleo
 * Un candidato proporciona su email y opcionalmente criterios de búsqueda
 */
export class CreateJobAlertDto {
  @IsEmail()
  email: string;

  /**
   * Patrón de búsqueda por palabras clave (título, descripción, empresa)
   * Ej: "Python", "Senior Developer", "Remote"
   */
  @IsString()
  @IsOptional()
  search_pattern?: string;

  /**
   * Tipo de empleo: 'full-time', 'part-time', 'contract', etc.
   */
  @IsString()
  @IsOptional()
  job_type?: string;

  /**
   * Nivel profesional: 'junior', 'senior', 'lead', etc.
   */
  @IsString()
  @IsOptional()
  level?: string;

  /**
   * Ubicación del empleo
   */
  @IsString()
  @IsOptional()
  location?: string;

  /**
   * Salario mínimo deseado
   */
  @IsNumber()
  @IsOptional()
  salary_min?: number;

  /**
   * Salario máximo deseado
   */
  @IsNumber()
  @IsOptional()
  salary_max?: number;

  /**
   * Activo por defecto, puede ser desactivado sin eliminar
   */
  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;
}
