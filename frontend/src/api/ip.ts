import { apiRequest } from '@/api/client';

export interface IpResponse {
  ip: string;
  forwarded_for?: string | null;
  real_ip?: string | null;
}

export function getPublicIp() {
  return apiRequest<IpResponse>('/api/ip');
}
