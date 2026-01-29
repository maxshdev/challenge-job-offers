import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JobApplicationsService } from './job-applications.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';

@Controller()
export class JobApplicationsController {
  constructor(private readonly applicationsService: JobApplicationsService) { }

  /**
   * Get all job applications (admin)
   * GET /api/job-applications
   */
  @Get('job-applications')
  async findAll() {
    return this.applicationsService.findAll();
  }

  /**
   * Apply to a job (does not require authentication, but can have it)
   * POST /api/jobs/:jobId/apply
   */
  @Post('jobs/:jobId/apply')
  async apply(
    @Param('jobId') jobId: string,
    @Body() dto: CreateJobApplicationDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id || null;
    return this.applicationsService.create(jobId, userId, dto);
  }

  /**
   * Get all applications for a job
   * GET /api/jobs/:jobId/applications
   */
  @Get('jobs/:jobId/applications')
  async findByJobId(@Param('jobId') jobId: string) {
    return this.applicationsService.findByJobId(jobId);
  }

  /**
   * Get application details
   * GET /api/jobs/:jobId/applications/:id
   */
  @Get('jobs/:jobId/applications/:id')
  async findOne(
    @Param('jobId') jobId: string,
    @Param('id') id: string,
  ) {
    return this.applicationsService.findOne(id);
  }

  /**
   * Update application status
   * PATCH /api/jobs/:jobId/applications/:id/status
   */
  @Patch('jobs/:jobId/applications/:id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('jobId') jobId: string,
    @Param('id') id: string,
    @Body() body: { status: 'pending' | 'reviewed' | 'accepted' | 'rejected' },
  ) {
    return this.applicationsService.updateStatus(id, body.status);
  }

  /**
   * Resend application notification
   * POST /api/jobs/:jobId/applications/:id/resend-notification
   */
  @Post('jobs/:jobId/applications/:id/resend-notification')
  @UseGuards(JwtAuthGuard)
  async resendNotification(
    @Param('jobId') jobId: string,
    @Param('id') id: string,
  ) {
    return this.applicationsService.resendNotification(id);
  }

  /**
   * Delete an application
   * DELETE /api/jobs/:jobId/applications/:id
   */
  @Delete('jobs/:jobId/applications/:id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('jobId') jobId: string,
    @Param('id') id: string,
  ) {
    await this.applicationsService.remove(id);
    return { message: 'Application deleted successfully' };
  }
}
