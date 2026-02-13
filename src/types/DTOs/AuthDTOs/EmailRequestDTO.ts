export interface EmailRequestDTO {
    to: string;
    subject: string;
    body: string;
    isHtml?: boolean;
    attachments?: string[];
}
