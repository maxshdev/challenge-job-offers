import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Job } from 'src/modules/jobs/job.entity';
import { JobAlert } from 'src/modules/job-alerts/job-alert.entity';
import { JobApplication } from 'src/modules/job-applications/job-application.entity';

@Entity('users')
export class User extends BaseEntity {
    @Column({ length: 150, unique: true })
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Job, (job) => job.posted_by, { cascade: true })
    jobs: Job[];

    @OneToMany(() => JobAlert, (alert) => alert.user, { cascade: true })
    jobAlerts: JobAlert[];

    @OneToMany(() => JobApplication, (app) => app.user, { cascade: true })
    job_applications: JobApplication[];
}
