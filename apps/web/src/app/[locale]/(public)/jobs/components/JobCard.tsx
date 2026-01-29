import Link from 'next/link';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  level: 'junior' | 'mid' | 'senior' | 'lead';
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  tags: string[];
}

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const getLevelColor = (level: string) => {
    const colors = {
      junior: 'badge-info',
      mid: 'badge-warning',
      senior: 'badge-success',
      lead: 'badge-error',
    };
    return colors[level as keyof typeof colors] || 'badge-info';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'full-time': 'bg-blue-100 text-blue-800',
      'part-time': 'bg-purple-100 text-purple-800',
      contract: 'bg-yellow-100 text-yellow-800',
      freelance: 'bg-green-100 text-green-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-shadow">
      <div className="card-body">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="card-title text-lg mb-1">{job.title}</h3>
            <p className="text-base-content/60 text-sm">{job.company}</p>
          </div>
          <div className={`badge ${getLevelColor(job.level)}`}>
            {job.level.toUpperCase()}
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
          <div className={`badge badge-sm font-semibold ${getTypeColor(job.type)}`}>
            {job.type}
          </div>
        </div>

        {/* Description */}
        <p className="text-base-content/80 text-sm line-clamp-2 my-3">{job.description}</p>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap mb-4">
          {job.tags.map((tag, idx) => (
            <span key={idx} className="badge badge-outline badge-sm">
              {tag}
            </span>
          ))}
        </div>

        {/* Salary & Button */}
        <div className="flex justify-between items-center pt-2 border-t border-base-300">
          <div className="text-sm font-semibold text-primary">
            {job.salary.currency} {job.salary.min.toLocaleString()}-{job.salary.max.toLocaleString()}
          </div>
          <Link href={`/jobs/${job.id}`} className="btn btn-sm btn-primary">
            Ver oferta
          </Link>
        </div>
      </div>
    </div>
  );
}
