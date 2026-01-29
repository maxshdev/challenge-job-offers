import { Injectable, NotFoundException, BadRequestException, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsOrder } from 'typeorm';

import { Job, JobType, JobLevel } from './job.entity';
import { CreateJobDto as CJD } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { FindJobsDto } from './dto/find-jobs.dto';
import { ExternalJobSourcesService } from '../external-job-sources/external-job-sources.service';
import { JobAlertsService } from '../job-alerts/job-alerts.service';

@Injectable()
export class JobsService {
    private readonly logger = new Logger(JobsService.name);
    private jobAlertsService: JobAlertsService;

    constructor(
        @InjectRepository(Job)
        private readonly jobsRepo: Repository<Job>,
        @Inject(forwardRef(() => ExternalJobSourcesService))
        private externalJobSourcesService: ExternalJobSourcesService,
    ) { }

    setJobAlertsService(service: JobAlertsService) {
        this.jobAlertsService = service;
    }

    async findAll(dto: FindJobsDto = new FindJobsDto()): Promise<{ data: Job[]; total: number; page: number; limit: number }> {
        const { search, page = 1, limit = 12, sort, includeExternal, type, level } = dto;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (search) {
            where.title = Like(`%${search}%`);
        }
        if (type) {
            where.job_type = type;
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

        if (includeExternal === 'true') {
            const localJobs = await this.jobsRepo.find({
                where: search ? [
                    { title: Like(`%${search}%`), ...((type ? { job_type: type } : {})), ...((level ? { level } : {})) }
                ] : where,
                order,
                relations: ['posted_by'],
            });

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

            let allJobs = [...localJobs, ...externalJobs];
            // Simple sort in memory for merged list
            allJobs.sort((a, b) => {
                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                return dateB - dateA;
            });

            const total = allJobs.length;
            const paginatedJobs = allJobs.slice(skip, skip + limit);

            return { data: paginatedJobs, total, page, limit };
        } else {
            const [data, total] = await this.jobsRepo.findAndCount({
                where: search ? [
                    { title: Like(`%${search}%`), ...((type ? { job_type: type } : {})), ...((level ? { level } : {})) }
                ] : where,
                order,
                skip,
                take: limit,
                relations: ['posted_by'],
            });

            return { data, total, page, limit };
        }
    }

    async findOne(id: string): Promise<Job> {
        let job: Job | null = null;
        try {
            job = await this.jobsRepo.findOne({
                where: { id },
                relations: ['posted_by'],
            });
        } catch (e) { }

        if (!job) {
            job = await this.jobsRepo.findOne({
                where: { external_id: id },
                relations: ['posted_by']
            });
        }

        if (job) return job;

        if (id.startsWith('ext-')) {
            const externalJob = await this.externalJobSourcesService.findOneExternalJob(id);
            if (externalJob) return externalJob;
        }

        throw new NotFoundException(`Job with id ${id} not found`);
    }

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
                const newJob = this.jobsRepo.create(externalJob);
                (newJob as any).id = undefined;
                newJob.external_id = id;
                return this.jobsRepo.save(newJob);
            }
        }

        throw new NotFoundException(`Job with id ${id} not found`);
    }

    async create(dto: CJD): Promise<Job> {
        const job = this.jobsRepo.create(dto);
        const savedJob = await this.jobsRepo.save(job);

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
}
