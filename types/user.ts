export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
}

export interface UserProfile {
  user: User | null;
  isAuthenticated: boolean;
}
