import { Entity, Column, BeforeInsert, BeforeUpdate, ManyToOne, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { UserProfile } from 'src/modules/user-profiles/user-profile.entity';
import { Role } from 'src/modules/roles/role.entity';
import { Job } from 'src/modules/jobs/job.entity';
import { JobAlert } from 'src/modules/job-alerts/job-alert.entity';
import { JobApplication } from 'src/modules/job-applications/job-application.entity';
import * as bcrypt from 'bcryptjs';

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 150, unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @ManyToOne(() => Role, (role) => role.id, { onDelete: 'SET NULL', nullable: true })
  role: Role | null;

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    cascade: true,
    eager: true,
  })
  profile: UserProfile | null;

  @OneToMany(() => Job, (job) => job.posted_by, { cascade: true })
  jobs: Job[];

  @OneToMany(() => JobAlert, (alert) => alert.user, { cascade: true })
  jobAlerts: JobAlert[];

  @OneToMany(() => JobApplication, (app) => app.user, { cascade: true })
  job_applications: JobApplication[];
}
