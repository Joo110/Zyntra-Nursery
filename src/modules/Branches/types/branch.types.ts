export interface BranchListDto {
  id: string;
  branchName: string;
  address?: string | null;
  phone?: string | null;
}

export interface BranchDropdownDto {
  id: string;
  branchName: string;
}

export interface AddBranchDto {
  branchName: string;
  address?: string | null;
  phone?: string | null;
}

export interface UpdateBranchDto {
  id: string;
  branchName?: string | null;
  address?: string | null;
  phone?: string | null;
}
