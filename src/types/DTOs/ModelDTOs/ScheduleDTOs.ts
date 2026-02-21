export interface ScheduleViewDTO {
    id: number;
    title: string;
    startTime: string; // ISO Date
    endTime: string;   // ISO Date
    userId: number;
}

export interface CreateScheduleDTO {
    title: string;
    startTime: string; // ISO Date
    endTime: string;   // ISO Date
}

export interface UpdateScheduleDTO {
    id: number;
    title?: string;
    startTime?: string; // ISO Date
    endTime?: string;   // ISO Date
}
