export interface ApiResponse<TData> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: TData | null;
  errors?: unknown;
  timestamp: string; // ISO string from backend
}
