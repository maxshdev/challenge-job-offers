import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../roles/role.entity';
import { UserProfile } from '../user-profiles/user-profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,

    @InjectRepository(Role)
    private readonly rolesRepo: Repository<Role>,

    @InjectRepository(UserProfile)
    private readonly profilesRepo: Repository<UserProfile>,
  ) { }

  async findAll(): Promise<User[]> {
    return this.usersRepo.find({
      relations: ['role', 'profile'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ['role', 'profile'],
    });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const role = await this.rolesRepo.findOne({ where: { id: dto.roleId } });
    if (!role) throw new NotFoundException(`Role ${dto.roleId} not found`);

    const profile = this.profilesRepo.create();

    const user = this.usersRepo.create({
      email: dto.email,
      password: dto.password, // hashing is done by entity
      role,
      profile,
    });

    return this.usersRepo.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.roleId) {
      const role = await this.rolesRepo.findOne({ where: { id: dto.roleId } });
      if (!role) throw new NotFoundException(`Role ${dto.roleId} not found`);
      user.role = role;
    }

    const { roleId, ...safeDto } = dto;

    if (safeDto.password) {
      user.password = safeDto.password; // hash by entity hooks
    }

    Object.assign(user, safeDto);

    return this.usersRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepo.remove(user);
  }
}
