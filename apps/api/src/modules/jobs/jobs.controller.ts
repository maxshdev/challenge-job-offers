import { Controller, Get, Post, Param, Body, Patch, Delete, Req, UseInterceptors, UploadedFile, Res, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import type { Express } from 'express';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { FindJobsDto } from './dto/find-jobs.dto';
import { JobApplicationsService } from 'src/modules/job-applications/job-applications.service';
import { CreateJobApplicationDto } from 'src/modules/job-applications/dto/create-job-application.dto';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly jobApplicationsService: JobApplicationsService,
  ) { }

  @Get()
  async findAll(@Query() query: FindJobsDto) {
    return this.jobsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateJobDto) {
    return this.jobsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }

  /**
   * Apply to a job
   * Endpoint: POST /api/jobs/:id/apply
   */
  @Post(':id/apply')
  async apply(
    @Param('id') jobId: string,
    @Body() dto: CreateJobApplicationDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id || null;
    return this.jobApplicationsService.create(jobId, userId, dto);
  }

  /**
   * Export all jobs to CSV
   * GET /api/jobs/export/csv
   */
  @Get('export/csv')
  async exportCsv(@Res() res: Response) {
    const csv = await this.jobsService.exportToCsv();
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="jobs-export.csv"');
    res.send(csv);
  }

  /**
   * Download CSV template for job upload
   * GET /api/jobs/template/csv
   */
  @Get('template/csv')
  async downloadTemplate(@Res() res: Response) {
    const csv = this.jobsService.getTemplateCsv();
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="jobs-template.csv"');
    res.send(csv);
  }

  /**
   * Import jobs from CSV file
   * POST /api/jobs/import/csv
   */
  @Post('import/csv')
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.jobsService.importFromCsv(file.buffer.toString('utf-8'));
  }
}
