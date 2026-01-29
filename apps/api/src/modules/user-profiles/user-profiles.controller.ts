import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { UserProfilesService } from './user-profiles.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Controller('users/:userId/profile')
export class UserProfilesController {
  constructor(private readonly userProfilesService: UserProfilesService) {}

  @Get()
  findOne(@Param('userId') userId: string) {
    return this.userProfilesService.findByUserId(userId);
  }

  @Patch()
  update(@Param('userId') userId: string, @Body() dto: UpdateUserProfileDto) {
    return this.userProfilesService.update(userId, dto);
  }
}
