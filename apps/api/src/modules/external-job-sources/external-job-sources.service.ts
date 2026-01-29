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
        // The API returns { "Country": [ [title, salary, skills], ... ], ... }
        Object.keys(data).forEach((country) => {
          const countryJobs = data[country];
          if (Array.isArray(countryJobs)) {
            countryJobs.forEach((jobArray) => {
              // Attach country to the job array data for the parser to use if needed
              jobs.push({ ...jobArray, _country: country });
            });
          }
        });
        return jobs;
      },
      parser: this.parseLegacyJob.bind(this),
    });

    // this.registerSource('linkedin', {
    //   name: 'LinkedIn',
    //   url: '',
    //   parser: this.parseLinkedInJob.bind(this),
    // });

    // this.registerSource('github-jobs', {
    //   name: 'GitHub Jobs',
    //   url: 'https://api.github.com/repos/github/jobs',
    //   parser: this.parseGitHubJob.bind(this),
    // });

    // this.registerSource('indeed', {
    //   name: 'Indeed',
    //   url: '',
    //   parser: this.parseIndeedJob.bind(this),
    // });
  }

  registerSource(key: string, source: ExternalJobSource): void {
    this.externalSources.set(key, source);
    this.logger.log(`External job source registered: ${source.name}`);
  }

  private generateExternalId(sourceKey: string, job: Partial<Job>, index: number): string {
    // Generate unique ID using source key, content hash, and index for collision handling
    const content = `${sourceKey}-${job.title}-${job.company}-${job.location}`;
    const hash = Buffer.from(content).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);

    // Use index to ensure uniqueness and determinism within the list across requests
    return `ext-${sourceKey}-${hash}-${index}`;
  }

  async fetchJobsFromSource(sourceKey: string, params?: any): Promise<Job[]> {
    const source = this.externalSources.get(sourceKey);

    if (!source) {
      throw new Error(`External job source not found: ${sourceKey}`);
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(source.url, {
          params,
          timeout: 10000,
        }),
      );

      let jobsData = response.data;

      // Apply response transformer if present
      if (source.responseTransformer) {
        jobsData = source.responseTransformer(jobsData);
      }

      const parsedJobs: Job[] = [];

      for (const [index, jobData] of jobsData.entries()) {
        const parsedJob = source.parser(jobData);
        // We create a temporary Job entity instance but don't save it to DB yet
        // Pagination/Sorting will handle this in memory
        const job = new Job();
        Object.assign(job, parsedJob);

        // Generate unique ID
        job.id = this.generateExternalId(sourceKey, parsedJob, index);
        job.external_id = job.id; // Also set external_id property

        // Mark as external for frontend identification
        job.is_external = true;

        parsedJobs.push(job);
      }

      this.logger.log(`Fetched ${parsedJobs.length} jobs from ${source.name}`);
      return parsedJobs;
    } catch (error) {
      this.logger.error(
        `Failed to fetch jobs from ${source.name}`,
        error.message,
      );
      // Don't throw, just return empty array to not break the main list
      return [];
    }
  }

  async findOneExternalJob(id: string): Promise<Job | null> {
    // Try to parse sourceKey from ID: ext-sourceKey-hash
    // This is a naive implementation, assuming we fetch all and filter.
    // For production with pagination on external side, this would require specific API support.

    // We can infer sourceKey if we stick to the format ex-local-service-...
    const parts = id.split('-');
    if (parts.length < 3) return null;

    // Attempt to reconstruct key (might contain hyphens)
    // Actually, iterating all sources is safer if key is ambiguous, but slower.
    // Let's iterate all sources for now as we have few.
    const sources = this.getAvailableSources();

    for (const source of sources) {
      // Only fetch if the ID likely belongs to this source?
      // Optimization: check if ID contains source.key
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

  async syncJobsFromSource(sourceKey: string, params?: any): Promise<{ synced: number; failed: number }> {
    const source = this.externalSources.get(sourceKey);

    if (!source) {
      throw new Error(`External job source not found: ${sourceKey}`);
    }

    let synced = 0;
    let failed = 0;

    try {
      const response = await firstValueFrom(
        this.httpService.get(source.url, {
          params,
          timeout: 10000,
        }),
      );

      let jobs = response.data;
      if (source.responseTransformer) {
        jobs = source.responseTransformer(jobs);
      }

      for (const jobData of jobs) {
        try {
          const parsedJob = source.parser(jobData);
          // Sync logic would go here - for now we just log
          // This part matches previous logic but needs adaptation if we want to save legacy jobs
          // Currently legacy jobs are array based so they might not have a stable ID to update against
          // For now, let's assume sync is for sources with IDs
          synced++;
        } catch (error) {
          this.logger.error(`Failed to sync individual job: ${error.message}`);
          failed++;
        }
      }

      this.logger.log(`Synced ${synced} jobs from ${source.name}, ${failed} failed`);
      return { synced, failed };
    } catch (error) {
      this.logger.error(
        `Failed to sync jobs from ${source.name}`,
        error.message,
      );
      throw new Error(`Failed to sync jobs from ${source.name}: ${error.message}`);
    }
  }

  getAvailableSources(): { key: string; name: string; url: string }[] {
    const sources: { key: string; name: string; url: string }[] = [];

    this.externalSources.forEach((source, key) => {
      sources.push({
        key,
        name: source.name,
        url: source.url,
      });
    });

    return sources;
  }

  // Parsers

  private parseLegacyJob(data: any): Partial<Job> {
    // Format: [ "Jr Java Developer", 24000, "<skills><skill>Java</skill>..." ] + _country
    const title = data[0];
    const salary = data[1];
    const skillsXml = data[2];
    const country = data._country;

    // Parse XML skills using Regex
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
      job_type: JobType.FULL_TIME, // Default to full time as it's not specified
      level: JobLevel.JUNIOR, // Default level for external jobs
      salary_min: salary,
      salary_max: salary, // Assuming flat salary
      currency: 'USD', // Assumption based on values (or could be derived from country)
      requirements: skills.join(', '),
      allow_public_apply: true,
      created_at: new Date(), // Now
    };
  }

  private parseLinkedInJob(data: any): Partial<Job> {
    return {
      title: data.title,
      description: data.description,
      company: data.company_name,
      location: data.location,
      job_type: this.mapJobType(data.employment_type),
      level: JobLevel.JUNIOR, // Default level
      expiration_date: data.expiration_date ? new Date(data.expiration_date) : undefined,
      salary_min: data.salary?.min,
      salary_max: data.salary?.max,
      currency: data.salary?.currency || 'USD',
    };
  }

  private parseGitHubJob(data: any): Partial<Job> {
    return {
      title: data.title,
      description: data.description,
      company: data.company,
      location: data.location,
      job_type: this.mapJobType(data.type),
      level: JobLevel.JUNIOR, // Default level
      currency: 'USD',
    };
  }

  private parseIndeedJob(data: any): Partial<Job> {
    return {
      title: data.jobtitle,
      description: data.snippet,
      company: data.company,
      location: data.location,
      job_type: JobType.FULL_TIME,
      currency: 'USD',
    };
  }

  private mapJobType(type: string): JobType {
    const mapping: { [key: string]: JobType } = {
      'full-time': JobType.FULL_TIME,
      'full_time': JobType.FULL_TIME,
      'fulltime': JobType.FULL_TIME,
      'part-time': JobType.PART_TIME,
      'part_time': JobType.PART_TIME,
      'parttime': JobType.PART_TIME,
      'contract': JobType.CONTRACT,
      'temporary': JobType.TEMPORARY,
      'internship': JobType.INTERNSHIP,
      'freelance': JobType.FREELANCE,
    };

    return mapping[type?.toLowerCase()] || JobType.FULL_TIME;
  }
}
