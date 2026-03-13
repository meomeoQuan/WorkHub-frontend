export interface JobDTO {
    id: number;
    jobName: string;
    location: string;
    salary: string;
    minSalary?: number;
    maxSalary?: number;
    salaryCurrency?: string;
    salaryCycle?: string;
    jobType: string;
    category?: string;
}
