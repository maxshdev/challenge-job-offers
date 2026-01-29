import { Controller, Get, Post, Param, Body, Patch, Delete, Query } from '@nestjs/common';
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

    @Post(':id/apply')
    async apply(
        @Param('id') jobId: string,
        @Body() dto: CreateJobApplicationDto,
    ) {
        return this.jobApplicationsService.create(jobId, null, dto);
    }
}
