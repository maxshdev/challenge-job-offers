"use server";

import { JobApplicationService } from "../job-application.service";

export const getApplicationsAction = async () =>
  JobApplicationService.getAll();

export const getApplicationsByJobIdAction = async (jobId: string) =>
  JobApplicationService.getByJobId(jobId);

export const getApplicationByIdAction = async (id: string) =>
  JobApplicationService.getById(id);

export const updateApplicationStatusAction = async (
  jobId: string,
  applicationId: string,
  status: string
) => JobApplicationService.updateStatus(jobId, applicationId, status);

import { auth } from "@/auth";

export const resendNotificationAction = async (
  jobId: string,
  applicationId: string
) => {
  const session = await auth();
  return JobApplicationService.resendNotification(jobId, applicationId, session?.user?.access_token);
};

export const deleteApplicationAction = async (
  jobId: string,
  applicationId: string
) => JobApplicationService.delete(jobId, applicationId);
