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
    userName: string;
    avatar?: string;
    requirements?: string;
    experienceLevel?: string;
    workSetting?: string;
    category?: string;
    companyBio?: string;
    companyRating: number;
    companyIndustry?: string;
    benefits?: string;
    companyLocation?: string;
    companyDescription?: string;
    companySize?: string;
}
