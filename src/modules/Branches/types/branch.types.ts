/** مطابق لـ BranchListDto */
export interface BranchListDto {
  id: string;
  branchName: string;
  address?: string | null;
  phone?: string | null;
}

/** مطابق لـ BranchDropdownDto */
export interface BranchDropdownDto {
  id: string;
  branchName: string;
}

/** مطابق لـ AddBranchDto */
export interface AddBranchDto {
  branchName: string;
  address?: string | null;
  phone?: string | null;
}

/** مطابق لـ UpdateBranchDto */
export interface UpdateBranchDto {
  id: string;
  branchName?: string | null;
  address?: string | null;
  phone?: string | null;
}
