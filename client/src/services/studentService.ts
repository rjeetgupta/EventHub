import axiosInstance from '@/api/axios';
import { ApiResponse } from '@/lib/types/common.types';

/** Bookmark row as returned by GET /students/me/bookmarks (event included). */
export type BookmarkRow = {
  id: string;
  createdAt: string;
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    mode: string;
    venue: string | null;
    link: string | null;
    status: string;
    category: string;
    currentRegistrations: number;
    maxCapacity: number;
    department: { name: string; code: string } | null;
    creator: { fullName: string };
  };
};

/** Club/group: a GROUP_ADMIN's group on campus. */
export type StudentGroup = {
  id: string;
  name: string;
  leader: string;
  department: { id: string; name: string; code: string } | null;
  eventCount: number;
  memberCount: number;
  isMember: boolean;
};

export type StudentGroupDetail = {
  id: string;
  name: string;
  leader: string;
  email: string;
  department: { id: string; name: string; code: string } | null;
  memberCount: number;
  isMember: boolean;
  events: { id: string; title: string; date: string; category: string }[];
};

type Wrapped<T> = { data: T };

const unwrap = <T,>(payload: unknown): T[] =>
  Array.isArray(payload)
    ? (payload as T[])
    : ((payload as Wrapped<T[]>)?.data ?? []);

export const studentService = {
  async getBookmarks(): Promise<BookmarkRow[]> {
    const response = await axiosInstance.get<ApiResponse<BookmarkRow[]>>(
      '/students/me/bookmarks',
    );
    return unwrap<BookmarkRow>(response.data.data);
  },

  async addBookmark(eventId: string): Promise<void> {
    await axiosInstance.post<ApiResponse<unknown>>('/students/me/bookmarks', {
      eventId,
    });
  },

  async removeBookmark(eventId: string): Promise<void> {
    await axiosInstance.delete<ApiResponse<unknown>>('/students/me/bookmarks', {
      data: { eventId },
    });
  },

  async getGroups(): Promise<StudentGroup[]> {
    const response = await axiosInstance.get<ApiResponse<StudentGroup[]>>(
      '/students/groups',
    );
    return unwrap<StudentGroup>(response.data.data);
  },

  async getGroupDetail(adminId: string): Promise<StudentGroupDetail> {
    const response = await axiosInstance.get<ApiResponse<StudentGroupDetail>>(
      `/students/groups/${adminId}`,
    );
    return response.data.data as StudentGroupDetail;
  },

  async joinGroup(groupId: string): Promise<void> {
    await axiosInstance.post<ApiResponse<unknown>>(
      `/students/groups/${groupId}/join`,
    );
  },

  async leaveGroup(groupId: string): Promise<void> {
    await axiosInstance.post<ApiResponse<unknown>>(
      `/students/groups/${groupId}/leave`,
    );
  },
};
