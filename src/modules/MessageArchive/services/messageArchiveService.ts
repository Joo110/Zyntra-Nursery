import { axiosInstance } from '@/services/api/axiosInstance';
import type { PagedResult, MessageResponse } from '@/types/pagination.types';
import { MemberTypeBodyValue } from '../../Salaries/types/enums.types';
import type { MessageArchiveDto, AddMessageArchiveDto } from '../types/messageArchive.types';

/** راجع 02-API-Contract-Detailed.md § 16) MessageArchive */
export const messageArchiveService = {
  getList: (branchId: string, pageNumber: number, take: number) =>
    axiosInstance
      .get<PagedResult<MessageArchiveDto>>(`/branches/${branchId}/MessageArchive/list`, { params: { pageNumber, take } })
      .then((res) => res.data),

  /** ⚠️ memberType JSON body property — نفس مشكلة Salaries/Treasury، لازم اسم العضو الكامل */
  add: (branchId: string, dto: AddMessageArchiveDto) =>
    axiosInstance
      .post<MessageResponse>(`/branches/${branchId}/MessageArchive`, {
        ...dto,
        memberType: MemberTypeBodyValue[dto.memberType],
      })
      .then((res) => res.data),

  remove: (branchId: string, messageId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/MessageArchive/${messageId}`).then((res) => res.data),
};