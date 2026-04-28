export interface User {
  id: number;
  email: string;
  username: string | null;
  created_at: string;
}

export interface AuthFormValues {
  email: string;
  password: string;
  username?: string;
}

export interface AuthResponse {
  user: User;
  message: string;
  access_token: string;
  token_type: string;
}
