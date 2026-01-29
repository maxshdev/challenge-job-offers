'use client';

import Link from 'next/link';
import { IJob } from '../interfaces/job.interface';

interface JobCardProps {
  job: IJob;
}

export default function JobCard({ job }: JobCardProps) {
  const getLevelColor = (level?: string) => {
    const normalizedLevel = level?.toLowerCase() || 'junior';
    const colors = {
      junior: 'badge-info',
      mid: 'badge-warning',
      senior: 'badge-success',
      lead: 'badge-error',
    };
    return colors[normalizedLevel as keyof typeof colors] || 'badge-info';
  };

  const getTypeLabel = (type?: string) => {
    const normalizedType = type?.toLowerCase() || 'full-time';
    const labels = {
      'full-time': 'Full Time',
      'part-time': 'Part Time',
      contract: 'Contrato',
      freelance: 'Freelance',
    };
    return labels[normalizedType as keyof typeof labels] || type || 'Full Time';
  };

  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-shadow">
      <div className="card-body">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="card-title text-lg mb-1 flex items-center gap-2">
              {job.title}
              {job.is_external && (
                <span className="badge badge-primary badge-outline text-xs">Externo</span>
              )}
            </h3>
            <p className="text-base-content/60 text-sm">{job.company}</p>
          </div>
          <div className={`badge ${getLevelColor(job.level)}`}>
            {(job.level || 'JUNIOR').toUpperCase()}
          </div>
        </div>

        {/* Location & Type */}
        <div className="flex gap-2 flex-wrap my-2">
          <div className="flex items-center gap-1 text-sm text-base-content/70">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {job.location}
          </div>
          <span className="badge badge-outline badge-sm">
            {getTypeLabel(job.type)}
          </span>
        </div>

        {/* Description */}
        <p className="text-base-content/80 text-sm line-clamp-2 my-3">{job.description}</p>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap mb-4">
          {job.tags?.map((tag, idx) => (
            <span key={idx} className="badge badge-outline badge-sm">
              {tag}
            </span>
          ))}
        </div>

        {/* Salary & Button */}
        <div className="flex justify-between items-center pt-2 border-t border-base-300">
          <div className="text-sm font-semibold text-primary">
            {job.salary_min && job.salary_max
              ? `$${job.salary_min.toLocaleString()}-$${job.salary_max.toLocaleString()}`
              : 'No especificado'}
          </div>
          <Link href={`/jobs/${job.id}`} className="btn btn-sm btn-primary">
            Ver oferta
          </Link>
        </div>
      </div>
    </div>
  );
}
