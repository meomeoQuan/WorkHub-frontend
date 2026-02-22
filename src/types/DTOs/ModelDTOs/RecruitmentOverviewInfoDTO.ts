export interface RecruitmentOverviewInfoDTO {
    id: number;
    userId: number;
    jobName: string;
    jobType: string;
    rating?: number;
    location?: string;
    salary?: string;
    status: string;
    description: string;
    userName: string;
    avatar?: string;
    createdAt: string;
}
