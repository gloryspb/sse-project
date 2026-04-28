import type { LucideIcon } from 'lucide-react';

export type ToolId =
  | 'text-counter'
  | 'case-converter'
  | 'json-formatter'
  | 'timestamp-converter'
  | 'password-generator'
  | 'qr-generator'
  | 'ip-detector';

export interface ToolDefinition {
  id: ToolId;
  icon: LucideIcon;
  title: string;
  description: string;
  accentColor: string;
}

export interface ToolActionPayload {
  tool_name: string;
  input_preview?: string | null;
  result_preview?: string | null;
}
