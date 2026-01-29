import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/modules/users/user.entity';

@Entity('job_alerts')
@Index(['user_id', 'is_active'])
export class JobAlert extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'text', nullable: true })
    search_pattern?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    job_type?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    level?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    location?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    salary_min?: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    salary_max?: number;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @ManyToOne(() => User, (user) => user.jobAlerts, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @Column({ type: 'uuid', nullable: true })
    user_id?: string;
}
