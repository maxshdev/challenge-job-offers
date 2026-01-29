export interface IJobSubscription {
    id: string;
    email: string;
    search_pattern?: string;
    job_type?: string;
    level?: string;
    location?: string;
    salary_min?: number;
    salary_max?: number;
    is_active: boolean;
    user_id?: string;
    created_at: string;
    updated_at: string;
}
