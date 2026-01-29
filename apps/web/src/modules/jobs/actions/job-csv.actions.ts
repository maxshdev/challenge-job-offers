"use server";

import { JobCsvService } from "../job-csv.service";

export const downloadJobsCsvAction = async () => {
  try {
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const downloadJobsTemplateAction = async () => {
  try {
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const uploadJobsCsvAction = async (file: File) => {
  try {
    const result = await JobCsvService.uploadCsv(file);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
