export interface IJob {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  level?: 'junior' | 'mid' | 'senior' | 'lead';
  description: string;
  salary_min?: number;
  salary_max?: number;
  allow_public_apply?: boolean;
  is_external?: boolean;
  created_at: string;
  updated_at: string;
}

export interface IJobApplication {
  id?: string;
  job_id: string;
  user_id?: string;
  email: string;
  phone?: string;
  cover_letter?: string;
  resume_url?: string;
  status?: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  created_at?: string;
  updated_at?: string;
}
