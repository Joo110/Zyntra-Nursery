import type { MemberType, SentVia } from '@/types/enums.types';

export interface MessageArchiveDto {
  id: string;
  memberId: string;
  memberName?: string | null;
  dateTime?: string | null;
  sentVia: SentVia;
  messageContant?: string | null;
  memberType: MemberType;
}
export interface AddMessageArchiveDto {
  memberId: string;
  dateTime: string;
  sentVia: SentVia;
  messageContant?: string | null;
  memberType: MemberType;
}
