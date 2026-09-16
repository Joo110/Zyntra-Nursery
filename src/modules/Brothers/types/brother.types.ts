export interface BrotherListDto {
  id: string;
  name: string;
  dateOfBirth: string;
  childId: string;
}
export interface AddBrotherInfoDto {
  name: string;
  dateOfBirth: string;
  childId: string;
}
export interface UpdateBrotherInfoDto {
  id: string;
  name?: string | null;
  dateOfBirth?: string | null;
  childId?: string | null;
}
