import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/modules/users/user.entity';

export enum JobType {
    FULL_TIME = 'full-time',
    PART_TIME = 'part-time',
    CONTRACT = 'contract',
    TEMPORARY = 'temporary',
    INTERNSHIP = 'internship',
    FREELANCE = 'freelance',
}

export enum JobLevel {
    JUNIOR = 'junior',
    SENIOR = 'senior',
    LEAD = 'lead',
    MANAGER = 'manager',
    EXECUTIVE = 'executive',
}

@Entity('jobs')
export class Job extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'text', nullable: true })
    requirements?: string;

    @Column({ type: 'varchar', length: 255 })
    company: string;

    @Column({ type: 'varchar', length: 255 })
    location: string;

    @Column({ type: 'varchar', length: 50, default: JobType.FULL_TIME })
    job_type: JobType;

    @Column({ type: 'varchar', length: 50, default: JobLevel.JUNIOR })
    level: JobLevel;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    salary_min?: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    salary_max?: number;

    @Column({ type: 'varchar', length: 10, nullable: true })
    currency?: string;

    @Column({ type: 'text', nullable: true })
    benefits?: string;

    @Column({ type: 'datetime', nullable: true })
    expiration_date?: Date;

    @Column({ type: 'boolean', default: true })
    allow_public_apply: boolean;

    @ManyToOne(() => User, (user) => user.jobs, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'posted_by_id' })
    posted_by?: User;

    @Column({ type: 'uuid', nullable: true })
    posted_by_id?: string;

    @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
    external_id?: string;

    @Column({ type: 'boolean', default: false })
    is_external: boolean;
}
