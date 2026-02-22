export interface RecruitmentDetailInfoDTO {
    id: number;
    userId: number;
    jobName: string;
    jobType: string;
    location?: string;
    salary?: string;
    status: boolean;
    createdAt: string;
    description: string;
    schedule?: string;
    userName: string;
    avatar?: string;
    requirements?: string;
    companyIndustry?: string;
    benefits?: string;
    companyLocation?: string;
    companyDescription?: string;
    companyBio?: string;
    category?: string;
    companyRating?: number;
}
