import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JobsService } from '../jobs/jobs.service';
import { Job, JobType, JobLevel } from 'src/modules/jobs/job.entity';

export interface ExternalJobSource {
    name: string;
    url: string;
    parser: (data: any) => Partial<Job>;
    responseTransformer?: (data: any) => any[];
}

@Injectable()
export class ExternalJobSourcesService {
    private readonly logger = new Logger(ExternalJobSourcesService.name);
    private externalSources: Map<string, ExternalJobSource> = new Map();

    constructor(
        @Inject(forwardRef(() => JobsService))
        private jobsService: JobsService,
        private httpService: HttpService,
    ) {
        this.initializeDefaultSources();
    }

    private initializeDefaultSources() {
        // Legacy API Service (Localhost 8080)
        this.registerSource('local-service', {
            name: 'Legacy Job Service',
            url: 'http://localhost:8080/jobs',
            responseTransformer: (data: any) => {
                const jobs: any[] = [];
                Object.keys(data).forEach((country) => {
                    const countryJobs = data[country];
                    if (Array.isArray(countryJobs)) {
                        countryJobs.forEach((jobArray) => {
                            jobs.push({ ...jobArray, _country: country });
                        });
                    }
                });
                return jobs;
            },
            parser: this.parseLegacyJob.bind(this),
        });
    }

    registerSource(key: string, source: ExternalJobSource): void {
        this.externalSources.set(key, source);
        this.logger.log(`External job source registered: ${source.name}`);
    }

    private generateExternalId(sourceKey: string, job: Partial<Job>, index: number): string {
        const content = `${sourceKey}-${job.title}-${job.company}-${job.location}`;
        const hash = Buffer.from(content).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
        return `ext-${sourceKey}-${hash}-${index}`;
    }

    async fetchJobsFromSource(sourceKey: string, params?: any): Promise<Job[]> {
        const source = this.externalSources.get(sourceKey);
        if (!source) {
            throw new Error(`External job source not found: ${sourceKey}`);
        }

        try {
            const response = await firstValueFrom<any>(
                this.httpService.get(source.url, {
                    params,
                    timeout: 10000,
                }),
            );

            let jobsData = response.data;
            if (source.responseTransformer) {
                jobsData = source.responseTransformer(jobsData);
            }

            const parsedJobs: Job[] = [];
            for (const [index, jobData] of jobsData.entries()) {
                const parsedJob = source.parser(jobData);
                const job = new Job();
                Object.assign(job, parsedJob);
                job.id = this.generateExternalId(sourceKey, parsedJob, index);
                job.external_id = job.id;
                job.is_external = true;
                parsedJobs.push(job);
            }

            this.logger.log(`Fetched ${parsedJobs.length} jobs from ${source.name}`);
            return parsedJobs;
        } catch (error) {
            this.logger.error(`Failed to fetch jobs from ${source.name}`, error.message);
            return [];
        }
    }

    async findOneExternalJob(id: string): Promise<Job | null> {
        const sources = this.getAvailableSources();
        for (const source of sources) {
            if (!id.includes(source.key)) continue;
            try {
                const jobs = await this.fetchJobsFromSource(source.key);
                const found = jobs.find(j => j.id === id);
                if (found) return found;
            } catch (e) {
                continue;
            }
        }
        return null;
    }

    getAvailableSources(): { key: string; name: string; url: string }[] {
        const sources: { key: string; name: string; url: string }[] = [];
        this.externalSources.forEach((source, key) => {
            sources.push({ key, name: source.name, url: source.url });
        });
        return sources;
    }

    private parseLegacyJob(data: any): Partial<Job> {
        const title = data[0];
        const salary = data[1];
        const skillsXml = data[2];
        const country = data._country;

        const skills: string[] = [];
        const skillRegex = /<skill>(.*?)<\/skill>/g;
        let match;
        while ((match = skillRegex.exec(skillsXml)) !== null) {
            skills.push(match[1]);
        }

        return {
            title: title,
            description: `Job opportunity in ${country}. Skills: ${skills.join(', ')}`,
            company: 'External Partner',
            location: country || 'Unknown',
            job_type: JobType.FULL_TIME,
            level: JobLevel.JUNIOR,
            salary_min: salary,
            salary_max: salary,
            currency: 'USD',
            requirements: skills.join(', '),
            allow_public_apply: true,
            created_at: new Date(),
        };
    }
}
