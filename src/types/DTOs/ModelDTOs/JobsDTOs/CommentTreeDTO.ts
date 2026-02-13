export interface CommentTreeDTO {
    id: number;
    userName: string;
    content?: string;
    createdAt?: string;
    replies: CommentTreeDTO[];
}
