import { JobDTO } from "./JobDTO";

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
    jobs: JobDTO[];

    // Engagement
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
}
