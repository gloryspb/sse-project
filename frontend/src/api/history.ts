import { apiRequest } from '@/api/client';
import type { HistoryCreatePayload, HistoryItem } from '@/types/history';

export function createHistoryItem(payload: HistoryCreatePayload) {
  return apiRequest<HistoryItem>('/api/history', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getHistory(limit = 20, offset = 0) {
  return apiRequest<HistoryItem[]>(`/api/history?limit=${limit}&offset=${offset}`);
}

export function clearHistory() {
  return apiRequest<{ message: string }>('/api/history', {
    method: 'DELETE',
  });
}
