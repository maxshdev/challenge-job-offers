import { Injectable, NotFoundException, BadRequestException, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsOrder, Between } from 'typeorm';

import { Job, JobType, JobLevel } from './job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { FindJobsDto } from './dto/find-jobs.dto';
import { ExternalJobSourcesService } from '../external-job-sources/external-job-sources.service';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);
  private jobAlertsService: any; // Dynamically injected

  constructor(
    @InjectRepository(Job)
    private readonly jobsRepo: Repository<Job>,
    @Inject(forwardRef(() => ExternalJobSourcesService))
    private externalJobSourcesService: ExternalJobSourcesService,
  ) { }

  /**
   * Inject JobAlertsService to avoid circular dependency
   */
  setJobAlertsService(service: any) {
    this.jobAlertsService = service;
  }

  async findAll(dto: FindJobsDto = new FindJobsDto()): Promise<{ data: Job[]; total: number; page: number; limit: number }> {
    const { search, page = 1, limit = 12, sort, includeExternal, type, level } = dto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.title = Like(`%${search}%`);
      // Or search in description etc, but for simplicity title
    }
    if (type) {
      where.job_type = type; // Note: entity uses job_type
    }
    if (level) {
      where.level = level;
    }

    const order: FindOptionsOrder<Job> = {};
    if (sort) {
      const [field, direction] = sort.split(':');
      if (['created_at', 'title', 'salary_min'].includes(field)) {
        order[field as any] = direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      }
    } else {
      order.created_at = 'DESC';
    }

    // Pass 1: Local Jobs
    // If merging, we need all local jobs to sort correctly with external ones
    // If not merging, we can rely on DB pagination
    if (includeExternal) {
      const localJobs = await this.jobsRepo.find({
        where: search ? [
          // If search is present, we need to combine it with type/level if they exist?
          // The previous logic was: if search, use Like on title. But if type is also present?
          // TypeORM 'where' array is OR. Object is AND.
          // To mix AND (type/level) and OR (search fields) is tricky with simple syntax.
          // Let's assume search filters narrowly on title AND type/level if present.
          { title: Like(`%${search}%`), ...((type ? { job_type: type } : {})), ...((level ? { level } : {})) }
        ] : where,
        order,
        relations: ['posted_by'],
      });

      // Pass 2: External Jobs
      let externalJobs: Job[] = [];
      try {
        const sources = this.externalJobSourcesService.getAvailableSources();
        for (const source of sources) {
          const params: any = {};
          if (search) params.name = search;
          if (type) params.type = type;
          if (level) params.level = level;

          const jobs = await this.externalJobSourcesService.fetchJobsFromSource(source.key, params);
          externalJobs = externalJobs.concat(jobs);
        }
      } catch (err) {
        this.logger.error('Error fetching external jobs', err);
      }

      // Filter External Jobs in memory just in case the source didn't filter them perfectly
      if (type || level) {
        externalJobs = externalJobs.filter(job => {
          let match = true;
          if (type && job.job_type !== type as any) match = false;
          if (level && job.level !== level as any) match = false;
          return match;
        });
      }

      // Merge
      let allJobs = [...localJobs, ...externalJobs];

      // Sort
      if (sort) {
        const [field, direction] = sort.split(':');
        allJobs.sort((a, b) => {
          let aVal = a[field as keyof Job];
          let bVal = b[field as keyof Job];

          if (aVal instanceof Date) aVal = aVal.getTime();
          if (bVal instanceof Date) bVal = bVal.getTime();

          const aV = aVal ?? 0;
          const bV = bVal ?? 0;

          if (aV < bV) return direction.toUpperCase() === 'DESC' ? 1 : -1;
          if (aV > bV) return direction.toUpperCase() === 'DESC' ? -1 : 1;
          return 0;
        });
      } else {
        // Default sort by created_at (External jobs set created_at to now)
        allJobs.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
      }

      // Paginate
      const total = allJobs.length;
      const paginatedJobs = allJobs.slice(skip, skip + limit);

      return {
        data: paginatedJobs,
        total,
        page,
        limit,
      };

    } else {
      // Standard DB query
      const [data, total] = await this.jobsRepo.findAndCount({
        where: search ? [
          { title: Like(`%${search}%`), ...((type ? { job_type: type } : {})), ...((level ? { level } : {})) }
        ] : where,
        order,
        skip,
        take: limit,
        relations: ['posted_by'],
      });

      return {
        data,
        total,
        page,
        limit,
      };
    }
  }

  async findOne(id: string): Promise<Job> {
    // 1. Try finding by UUID or external_id in DB
    // Note: If ID is not UUID, typeorm might error on 'id' check? 
    // Standard TypeORM uuid check usually happens. 
    // Let's rely on string check or separate if.

    let job: Job | null = null;

    try {
      job = await this.jobsRepo.findOne({
        where: [
          { id }, // If id is not UUID this might fail if DB column is strict UUID. 
          // But 'id' param is likely route param string.
          // If it fails we catch.
        ],
        relations: ['posted_by'],
      });
    } catch (e) {
      // Ignore UUID error if any
    }

    if (!job) {
      // Check by external_id
      job = await this.jobsRepo.findOne({
        where: { external_id: id },
        relations: ['posted_by']
      });
    }

    if (job) return job;

    // 2. If not found and looks like external ID, fetch from source
    if (id.startsWith('ext-')) {
      try {
        const externalJob = await this.externalJobSourcesService.findOneExternalJob(id);
        if (externalJob) return externalJob; // Return unsaved job for viewing
      } catch (err) {
        this.logger.error(`Failed to find external job ${id}: ${err.message}`);
      }
    }

    throw new NotFoundException(`Job with id ${id} not found`);
  }

  /**
   * Find a job and persist it if it's an external job not yet in DB.
   * Used when applying to an external job.
   */
  async findAndPersist(id: string): Promise<Job> {
    let job: Job | null = null;
    try {
      job = await this.jobsRepo.findOne({ where: { id } });
    } catch { }

    if (!job) {
      job = await this.jobsRepo.findOne({ where: { external_id: id } });
    }

    if (job) return job;

    if (id.startsWith('ext-')) {
      const externalJob = await this.externalJobSourcesService.findOneExternalJob(id);
      if (externalJob) {
        // Persist it
        const newJob = this.jobsRepo.create(externalJob);
        // Reset ID to let DB generate UUID, but keep external_id
        // externalJob.id was set to 'ext-...'. We want to keep that in external_id.
        // And newJob.id should be undefined so it generates UUID.
        (newJob as any).id = undefined;
        // Ensure external_id is set
        newJob.external_id = id;

        return this.jobsRepo.save(newJob);
      }
    }

    throw new NotFoundException(`Job with id ${id} not found`);
  }

  async create(dto: CreateJobDto): Promise<Job> {
    const job = this.jobsRepo.create(dto);
    const savedJob = await this.jobsRepo.save(job);

    // Trigger alert notifications asynchronously (without waiting)
    if (this.jobAlertsService) {
      this.jobAlertsService.notifyOnNewJob(savedJob).catch((error: any) => {
        this.logger.error(`Failed to notify alerts about new job: ${error.message}`);
      });
    }

    return savedJob;
  }

  async update(id: string, dto: UpdateJobDto): Promise<Job> {
    const job = await this.findOne(id);

    Object.assign(job, dto);
    return this.jobsRepo.save(job);
  }

  async remove(id: string): Promise<void> {
    const job = await this.findOne(id);
    await this.jobsRepo.remove(job);
  }

  /**
   * Export all jobs to CSV
   */
  async exportToCsv(): Promise<string> {
    const result = await this.findAll({ limit: 0, includeExternal: false } as FindJobsDto);
    const jobs = result.data;

    if (jobs.length === 0) {
      return this.getTemplateCsv();
    }

    const headers = [
      'ID',
      'Título',
      'Empresa',
      'Ubicación',
      'Tipo',
      'Nivel',
      'Descripción',
      'Requerimientos',
      'Beneficios',
      'Salario Mínimo',
      'Salario Máximo',
      'Moneda',
      'Permite Postularse Públicamente',
      'Fecha Creación',
    ];

    const rows = jobs.map((job) => [
      job.id,
      this.escapeCsv(job.title),
      this.escapeCsv(job.company),
      this.escapeCsv(job.location),
      job.job_type,
      job.level,
      this.escapeCsv(job.description),
      this.escapeCsv(job.requirements || ''),
      this.escapeCsv(job.benefits || ''),
      job.salary_min || '',
      job.salary_max || '',
      job.currency || 'USD',
      job.allow_public_apply ? 'Sí' : 'No',
      job.created_at,
    ]);

    return [headers, ...rows].map((row) => row.join(',')).join('\n');
  }

  /**
   * Get CSV template
   */
  getTemplateCsv(): string {
    const headers = [
      'Título',
      'Empresa',
      'Ubicación',
      'Tipo',
      'Nivel',
      'Descripción',
      'Requerimientos',
      'Beneficios',
      'Salario Mínimo',
      'Salario Máximo',
      'Moneda',
      'Permite Postularse Públicamente',
    ];

    const exampleRow = [
      'Senior Developer',
      'Tech Company',
      'Madrid, España',
      'full-time',
      'senior',
      '"Buscamos un developer senior con experiencia en React y Node.js"',
      '"5+ años de experiencia en desarrollo backend"',
      '"Seguro médico, home office, bonus anual"',
      '40000',
      '60000',
      'EUR',
      'Sí',
    ];

    return [headers, exampleRow].map((row) => row.join(',')).join('\n');
  }

  /**
   * Import jobs from CSV
   */
  async importFromCsv(csvContent: string): Promise<{ created: number; failed: number; errors: string[] }> {
    const lines = csvContent.split('\n').filter((line) => line.trim());

    if (lines.length < 2) {
      throw new BadRequestException('El archivo CSV debe contener al menos una fila de datos');
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const errors: string[] = [];
    let created = 0;
    let failed = 0;

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = this.parseCsvLine(lines[i]);

        if (values.length === 0) continue;

        const jobData = {
          title: values[0],
          company: values[1],
          location: values[2],
          job_type: (values[3] || 'full-time') as JobType,
          level: (values[4] || 'junior') as JobLevel,
          description: values[5],
          requirements: values[6] || undefined,
          benefits: values[7] || undefined,
          salary_min: values[8] ? parseInt(values[8]) : undefined,
          salary_max: values[9] ? parseInt(values[9]) : undefined,
          currency: values[10] || 'USD',
          allow_public_apply: values[11]?.toLowerCase() === 'sí' || values[11]?.toLowerCase() === 'yes' || values[11] === '1',
        };

        const job = this.jobsRepo.create(jobData);

        await this.jobsRepo.save(job);
        created++;

        // Notify alerts asynchronously
        if (this.jobAlertsService) {
          this.jobAlertsService.notifyOnNewJob(job).catch((error: any) => {
            this.logger.error(`Failed to notify alerts about new job: ${error.message}`);
          });
        }
      } catch (error: any) {
        failed++;
        errors.push(`Fila ${i + 1}: ${error.message}`);
      }
    }

    return { created, failed, errors };
  }

  /**
   * Parse a CSV line keeping values between quotes
   */
  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  /**
   * Escape CSV values
   */
  private escapeCsv(value: string | undefined): string {
    if (!value) return '';

    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }

    return value;
  }
}
