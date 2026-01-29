import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { JobAlertsService } from './job-alerts.service';
import { CreateJobAlertDto } from './dto/create-job-alert.dto';
import { UpdateJobAlertDto } from './dto/update-job-alert.dto';

@Controller('job-alerts')
export class JobAlertsController {
  constructor(private readonly jobAlertsService: JobAlertsService) {}

  @Get()
  findAll() {
    return this.jobAlertsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobAlertsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateJobAlertDto) {
    return this.jobAlertsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateJobAlertDto) {
    return this.jobAlertsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobAlertsService.remove(id);
  }
}
