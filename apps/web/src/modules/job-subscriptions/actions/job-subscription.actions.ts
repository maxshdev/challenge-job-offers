import { JobSubscriptionService } from "../job-subscription.service";

export const getJobSubscriptionsAction = () => JobSubscriptionService.getAll();
export const getJobSubscriptionByIdAction = (id: string) => JobSubscriptionService.getById(id);
export const createJobSubscriptionAction = (data: any) => JobSubscriptionService.create(data);
export const updateJobSubscriptionAction = (id: string, data: any) => JobSubscriptionService.update(id, data);
export const deleteJobSubscriptionAction = (id: string) => JobSubscriptionService.delete(id);
