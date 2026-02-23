export interface CommentTreeDTO {
    id: number;
    userName: string;
    content?: string;
    userUrl?: string;
    createdAt?: string;
    replies: CommentTreeDTO[];
}
