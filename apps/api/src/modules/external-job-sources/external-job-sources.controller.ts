import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ExternalJobSourcesService } from './external-job-sources.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('external-job-sources')
@Controller('external-job-sources')
export class ExternalJobSourcesController {
  constructor(private readonly externalJobSourcesService: ExternalJobSourcesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available external job sources' })
  @ApiResponse({ status: 200, description: 'List of available sources' })
  getAvailableSources() {
    return this.externalJobSourcesService.getAvailableSources();
  }

  @Post('sync/:sourceKey')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync jobs from an external source' })
  @ApiResponse({ status: 200, description: 'Sync results' })
  async syncFromSource(
    @Param('sourceKey') sourceKey: string,
    @Query() params: any,
  ) {
    return this.externalJobSourcesService.syncJobsFromSource(sourceKey, params);
  }

  @Post('fetch/:sourceKey')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch jobs from an external source' })
  @ApiResponse({ status: 200, description: 'Fetched jobs' })
  async fetchFromSource(
    @Param('sourceKey') sourceKey: string,
    @Query() params: any,
  ) {
    return this.externalJobSourcesService.fetchJobsFromSource(sourceKey, params);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new external job source' })
  @ApiResponse({ status: 201, description: 'Source registered' })
  registerSource(
    @Body() sourceData: {
      key: string;
      name: string;
      url: string;
    },
  ) {
    this.externalJobSourcesService.registerSource(sourceData.key, {
      name: sourceData.name,
      url: sourceData.url,
      parser: (data: any) => ({
        title: data.title,
        description: data.description,
        company: data.company,
        location: data.location,
        external_source_url: data.url || data.link,
      }),
    });

    return { message: 'Source registered successfully', source: sourceData };
  }
}
