import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { User } from 'src/modules/users/user.entity';
import { Role } from 'src/modules/roles/role.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserProfile } from '../user-profiles/user-profile.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
    @InjectRepository(UserProfile) private readonly profilesRepo: Repository<UserProfile>,
    private readonly jwtService: JwtService,
  ) { }

  async register(data: RegisterDto) {
    const exists = await this.userRepo.findOne({ where: { email: data.email } });
    if (exists) throw new BadRequestException('Email already registered');

    const defaultRole = (await this.rolesRepo.findOne({ where: { name: 'user' } })) || undefined;

    const user = this.userRepo.create({
      email: data.email,
      password: data.password,
      role: defaultRole,
      profile: this.profilesRepo.create(), // Always create empty profile
    });

    const savedUser = await this.userRepo.save(user, { reload: true });

    const payload = {
      sub: savedUser.id,
      email: savedUser.email,
      role: savedUser.role?.name,
    };

    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['role', 'profile'],
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role?.name };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role?.name,
        profile: user.profile,
      },
      access_token,
    };
  }
}
