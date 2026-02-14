export interface CommentDTO {
    id: number;
    postId: number;
    userId: number;
    userUrl: string;
    userName: string;
    parentCommentId?: number;
    content?: string;
    createdAt?: string;
    replies?: CommentDTO[];
}
