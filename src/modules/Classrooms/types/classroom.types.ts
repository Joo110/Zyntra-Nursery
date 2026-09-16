export interface ClassMenuDto {
  id: string;
  class: string | null;
  teacherName: string | null;
  totalKids: number;
}

export interface AddClassroomDto {
  class: string;
}

export interface UpdateClassroomDto {
  id: string;
  class?: string | null;
  capacity?: number | null;
}
