export interface JobPostDTO {
    // Post
    postId: number;
    header?: string;
    content?: string;
    postImage?: string;
    createdAt?: string;

    // User / Company
    userId: number;
    fullName: string;
    rating?: number;
    avatarUrl?: string;

    // Job info
    jobId: number;
    jobLocation?: string;
    jobSalaryRange?: string;
    jobType?: string;
    jobName?: string;

    // Engagement
    likeCount: number;
    commentCount: number;
}
