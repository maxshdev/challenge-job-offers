import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.usersRepo.find();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.usersRepo.findOne({
            where: { id },
        });

        if (!user) throw new NotFoundException(`User with id ${id} not found`);

        return user;
    }

    async create(dto: CreateUserDto): Promise<User> {
        const user = this.usersRepo.create({
            email: dto.email,
            password: dto.password,
        });

        return this.usersRepo.save(user);
    }

    async update(id: string, dto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);
        Object.assign(user, dto);
        return this.usersRepo.save(user);
    }

    async remove(id: string): Promise<void> {
        const user = await this.findOne(id);
        await this.usersRepo.remove(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepo.findOne({ where: { email } });
    }
}
