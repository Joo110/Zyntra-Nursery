export interface DriverListDto {
  id: string;
  branchId: string;
  branchName: string;
  name: string;
  phoneNumber: string;
  isSmoking: boolean;
}

export interface DriverDropdownDto {
  id: string;
  name: string;
  branchName: string;
}

export interface DriverDetailsDto {
  id: string;
  name: string;
  phoneNumber: string;
  isSmoking: boolean;
  branchId: string;
  branchName: string;
}

export interface AddDriverDto {
  branchId: string;
  name: string;
  phoneNumber: string;
  isSmoking: boolean;
}

export interface UpdateDriverDto {
  id: string;
  name?: string;
  phoneNumber?: string;
  isSmoking?: boolean;
}