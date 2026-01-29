import {
    Controller,
    Get,
    Post,
    Param,
    Query,
    Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExternalJobSourcesService } from './external-job-sources.service';

@ApiTags('external-job-sources')
@Controller('external-job-sources')
export class ExternalJobSourcesController {
    constructor(private readonly externalJobSourcesService: ExternalJobSourcesService) { }

    @Get()
    @ApiOperation({ summary: 'Get all available external job sources' })
    @ApiResponse({ status: 200, description: 'List of available sources' })
    getAvailableSources() {
        return this.externalJobSourcesService.getAvailableSources();
    }

    @Post('fetch/:sourceKey')
    @ApiOperation({ summary: 'Fetch jobs from an external source' })
    @ApiResponse({ status: 200, description: 'Fetched jobs' })
    async fetchFromSource(
        @Param('sourceKey') sourceKey: string,
        @Query() params: any,
    ) {
        return this.externalJobSourcesService.fetchJobsFromSource(sourceKey, params);
    }

    @Post('register')
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
            }),
        });

        return { message: 'Source registered successfully', source: sourceData };
    }
}
