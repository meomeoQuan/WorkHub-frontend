export interface RecruitmentDetailInfoDTO {
    id: number;
    jobName: string;
    jobType: string;
    location?: string;
    salary?: string;
    status: boolean;
    createdAt: string;
    description: string;
    schedule?: string;
}
