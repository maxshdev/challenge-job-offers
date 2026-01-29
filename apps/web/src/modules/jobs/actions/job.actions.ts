import { JobService } from "../job.service";

export const getJobsAction = (filters?: any) => JobService.getAll(filters);
export const getJobByIdAction = (id: string) => JobService.getById(id);
export const createJobAction = (data: any) => JobService.create(data);
export const updateJobAction = (id: string, data: any) => JobService.update(id, data);
export const deleteJobAction = (id: string) => JobService.delete(id);
export const applyJobAction = (jobId: string, data: any) => JobService.apply(jobId, data);
