export interface LevelDto {
  id: string;
  levelName: string | null;
  levelContent: string | null;
  totalKids: number;
}

export interface AddLevelDto {
  levelName?: string | null;
  levelContent?: string | null;
}

export interface UpdateLevelDto {
  id: string;
  levelName?: string | null;
  levelContent?: string | null;
}
