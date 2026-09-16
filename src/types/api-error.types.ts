
export interface ApiError {
  status: number;
  message: string;
  rawMessage?: string;

  validationErrors?: Record<string, string[]>;
  code?: string;
}
