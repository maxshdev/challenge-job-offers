'use client';

import { IJob } from '../interfaces/job.interface';
import JobCard from './JobCard';

interface JobsGridProps {
  jobs: IJob[];
  loading?: boolean;
}

export default function JobsGrid({ jobs, loading }: JobsGridProps) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card bg-base-100 shadow animate-pulse">
            <div className="card-body space-y-4">
              <div className="h-6 bg-base-300 rounded w-3/4"></div>
              <div className="h-4 bg-base-300 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-base-300 rounded"></div>
                <div className="h-4 bg-base-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="alert alert-info">
        <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>No se encontraron ofertas con los filtros seleccionados</span>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
