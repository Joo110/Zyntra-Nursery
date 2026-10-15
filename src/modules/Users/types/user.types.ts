import type { Gender, UserRole } from '@/types/enums.types';

export interface LoggedInStaffDto {
  userId: string;
  userName: string;
  imagePath?: string | null;
  role: UserRole;
  lastLoginAt: string; // ISO DateTime
}

export interface UserListDto {
  id: string;
  name: string;
  userName: string;
  role: UserRole;
  jopName?: string | null;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
}

export interface UserDetailDto {
  id: string;
  name: string;
  userName: string;
  role: UserRole;
  imagePath?: string | null;
  gender?: string | null;
  jopName?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
  lastLoginAt?: string | null;
}

export interface AddUserDto {
  name: string;
  userName: string;
  password: string;
  tempPassword?: string | null;
  role: UserRole;
  imagePath?: string | null;
  gender: Gender;
  jopName?: string | null;
  isActive: boolean;
}

export interface UpdateUserDto {
  id: string;
  name?: string | null;
  userName?: string | null;
  password?: string | null;
  tempPassword?: string | null;
  role?: UserRole | null;
  imagePath?: string | null;
  gender?: Gender | null;
  jopName?: string | null;
  isActive?: boolean | null;
}

export interface UserStatisticsDto {
  total: number;
  active: number;
  inactive: number;
}
