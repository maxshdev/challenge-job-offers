import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { User } from '../users/user.entity';

@Injectable()
export class UserProfilesService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly profilesRepo: Repository<UserProfile>,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) { }

  // Better to get profile through user (avoids problems if relation owner is UserProfile)
  async findByUserId(userId: string): Promise<UserProfile> {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user || !user.profile) throw new NotFoundException(`Profile for user ${userId} not found`);
    return user.profile;
  }

  async update(profileId: string, dto: UpdateUserProfileDto): Promise<UserProfile> {
    const profile = await this.profilesRepo.findOne({ where: { id: profileId } });

    if (!profile) throw new NotFoundException(`Profile ${profileId} not found`);

    Object.assign(profile, dto);

    return this.profilesRepo.save(profile);
  }
}
