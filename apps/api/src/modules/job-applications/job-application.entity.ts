import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/modules/users/user.entity';
import { Job } from 'src/modules/jobs/job.entity';

@Entity('job_applications')
@Index(['user_id', 'job_id'], { unique: true })
export class JobApplication extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone?: string;

  @Column({ type: 'text', nullable: true })
  cover_letter?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resume_url?: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: string;

  @ManyToOne(() => User, (user) => user.job_applications, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ type: 'uuid', nullable: true })
  user_id?: string;

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Column({ type: 'uuid' })
  job_id: string;
}
