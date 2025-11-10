export interface LoginRequestDTO { email: string; password: string; }
export interface LoginResponseDTO { token: string; teacher: { id: number; full_name: string; email: string; }; }
export interface ForgotPasswordRequestDTO { email: string; }