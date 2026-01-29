import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Patch,
    Delete,
    Req,
} from '@nestjs/common';
import { JobApplicationsService } from './job-applications.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';

@Controller()
export class JobApplicationsController {
    constructor(private readonly applicationsService: JobApplicationsService) { }

    @Get('job-applications')
    async findAll() {
        return this.applicationsService.findAll();
    }

    @Post('jobs/:jobId/apply')
    async apply(
        @Param('jobId') jobId: string,
        @Body() dto: CreateJobApplicationDto,
        @Req() req: any,
    ) {
        const userId = req.user?.id || null;
        return this.applicationsService.create(jobId, userId, dto);
    }

    @Get('jobs/:jobId/applications')
    async findByJobId(@Param('jobId') jobId: string) {
        return this.applicationsService.findByJobId(jobId);
    }

    @Get('jobs/:jobId/applications/:id')
    async findOne(
        @Param('jobId') jobId: string,
        @Param('id') id: string,
    ) {
        return this.applicationsService.findOne(id);
    }

    @Patch('jobs/:jobId/applications/:id/status')
    async updateStatus(
        @Param('jobId') jobId: string,
        @Param('id') id: string,
        @Body() body: { status: 'pending' | 'reviewed' | 'accepted' | 'rejected' },
    ) {
        return this.applicationsService.updateStatus(id, body.status);
    }

    @Post('jobs/:jobId/applications/:id/resend-notification')
    async resendNotification(
        @Param('jobId') jobId: string,
        @Param('id') id: string,
    ) {
        return this.applicationsService.resendNotification(id);
    }

    @Delete('jobs/:jobId/applications/:id')
    async remove(
        @Param('jobId') jobId: string,
        @Param('id') id: string,
    ) {
        await this.applicationsService.remove(id);
        return { message: 'Application deleted successfully' };
    }
}
