export interface HistoryItem {
  id: number;
  tool_name: string;
  input_preview: string | null;
  result_preview: string | null;
  created_at: string;
}

export interface HistoryCreatePayload {
  tool_name: string;
  input_preview?: string | null;
  result_preview?: string | null;
}
