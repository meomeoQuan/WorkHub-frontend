export interface UserExperienceDTO {
    id: number;
    title: string;
    company: string;
    startDate: string; // ISO Date
    endDate?: string; // ISO Date
    description?: string;
}

export interface UserEducationDTO {
    id: number;
    school: string;
    degree: string;
    fieldOfStudy: string;
    startYear: string;
    endYear?: string;
    description?: string;
}

export interface UserScheduleDTO {
    id: number;
    title?: string;
    startTime: string; // ISO Date
    endTime: string; // ISO Date
}

export interface UserProfileDTO {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    location?: string;
    role: number;
    provider?: string;

    // Extended
    bio?: string;
    title?: string; // Job Preference
    about?: string;
    cvUrl?: string;

    // Company Info
    website?: string;
    companySize?: string;
    foundedYear?: number;
    industry?: string;

    // Collections
    skills: string[];
    experiences: UserExperienceDTO[];
    educations: UserEducationDTO[];
    schedules: UserScheduleDTO[];
}
