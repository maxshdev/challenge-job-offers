import { useState, useEffect } from "react";
import { JobService } from "../job.service";
import { IJob } from "../interfaces/job.interface";

export function useJobs(initialData: IJob[] = []) {
  const [jobs, setJobs] = useState<IJob[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await JobService.getAll();
      setJobs(data);
    } catch (err: any) {
      setError(err.message || "Error cargando empleos");
    } finally {
      setLoading(false);
    }
  };

  const addJob = (job: IJob) => setJobs([job, ...jobs]);
  const updateJob = (updated: IJob) =>
    setJobs(jobs.map((j) => (j.id === updated.id ? updated : j)));
  const removeJob = (id: string) => setJobs(jobs.filter((j) => j.id !== id));

  useEffect(() => {
    if (!initialData.length) fetchJobs();
  }, []);

  return { jobs, loading, error, fetchJobs, addJob, updateJob, removeJob };
}
