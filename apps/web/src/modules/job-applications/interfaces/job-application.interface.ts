export interface IJobApplication {
  id: string;
  email: string;
  phone?: string;
  cover_letter?: string;
  resume_url?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  job_id: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  job?: {
    id: string;
    title: string;
    company: string;
  };
  user?: {
    id: string;
    email: string;
  };
}
