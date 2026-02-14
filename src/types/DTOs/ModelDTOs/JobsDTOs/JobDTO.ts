export interface JobDTO {
    id: number;
    jobName: string;
    location: string;
    salary: string;
    jobType: string;
    experienceLevel?: string;
    category?: string;
    workSetting?: string;
    companySize?: string;
}
