import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  studentService,
  BookmarkRow,
  StudentGroup,
} from '@/services/studentService';

interface StudentState {
  bookmarks: BookmarkRow[];
  /** Quick lookup set of bookmarked event ids (for card toggle buttons). */
  bookmarkIds: string[];
  bookmarksLoading: boolean;

  groups: StudentGroup[];
  groupsLoading: boolean;

  error: string | null;
}

const initialState: StudentState = {
  bookmarks: [],
  bookmarkIds: [],
  bookmarksLoading: false,
  groups: [],
  groupsLoading: false,
  error: null,
};

const rejectMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Request failed';

export const fetchBookmarks = createAsyncThunk<
  BookmarkRow[],
  void,
  { rejectValue: string }
>('student/fetchBookmarks', async (_, { rejectWithValue }) => {
  try {
    return await studentService.getBookmarks();
  } catch (error) {
    return rejectWithValue(rejectMessage(error));
  }
});

export const addBookmark = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('student/addBookmark', async (eventId, { rejectWithValue }) => {
  try {
    await studentService.addBookmark(eventId);
    return eventId;
  } catch (error) {
    return rejectWithValue(rejectMessage(error));
  }
});

export const removeBookmark = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('student/removeBookmark', async (eventId, { rejectWithValue }) => {
  try {
    await studentService.removeBookmark(eventId);
    return eventId;
  } catch (error) {
    return rejectWithValue(rejectMessage(error));
  }
});

export const fetchGroups = createAsyncThunk<
  StudentGroup[],
  void,
  { rejectValue: string }
>('student/fetchGroups', async (_, { rejectWithValue }) => {
  try {
    return await studentService.getGroups();
  } catch (error) {
    return rejectWithValue(rejectMessage(error));
  }
});

export const joinGroup = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('student/joinGroup', async (groupId, { rejectWithValue }) => {
  try {
    await studentService.joinGroup(groupId);
    return groupId;
  } catch (error) {
    return rejectWithValue(rejectMessage(error));
  }
});

export const leaveGroup = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('student/leaveGroup', async (groupId, { rejectWithValue }) => {
  try {
    await studentService.leaveGroup(groupId);
    return groupId;
  } catch (error) {
    return rejectWithValue(rejectMessage(error));
  }
});

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    clearStudentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // BOOKMARKS
      .addCase(fetchBookmarks.pending, (state) => {
        state.bookmarksLoading = true;
        state.error = null;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.bookmarksLoading = false;
        state.bookmarks = action.payload;
        state.bookmarkIds = action.payload.map((row) => row.event.id);
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.bookmarksLoading = false;
        state.error = action.payload ?? 'Failed to fetch bookmarks';
      })

      .addCase(addBookmark.fulfilled, (state, action) => {
        if (!state.bookmarkIds.includes(action.payload)) {
          state.bookmarkIds.push(action.payload);
        }
      })
      .addCase(addBookmark.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to bookmark event';
      })

      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.bookmarkIds = state.bookmarkIds.filter(
          (id) => id !== action.payload,
        );
        state.bookmarks = state.bookmarks.filter(
          (row) => row.event.id !== action.payload,
        );
      })
      .addCase(removeBookmark.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to remove bookmark';
      })

      // GROUPS
      .addCase(fetchGroups.pending, (state) => {
        state.groupsLoading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.groupsLoading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.groupsLoading = false;
        state.error = action.payload ?? 'Failed to fetch groups';
      })

      .addCase(joinGroup.fulfilled, (state, action) => {
        state.groups = state.groups.map((group) =>
          group.id === action.payload
            ? {
                ...group,
                isMember: true,
                memberCount: group.memberCount + 1,
              }
            : group,
        );
      })
      .addCase(joinGroup.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to join group';
      })

      .addCase(leaveGroup.fulfilled, (state, action) => {
        state.groups = state.groups.map((group) =>
          group.id === action.payload
            ? {
                ...group,
                isMember: false,
                memberCount: Math.max(0, group.memberCount - 1),
              }
            : group,
        );
      })
      .addCase(leaveGroup.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to leave group';
      });
  },
});

export const { clearStudentError } = studentSlice.actions;
export default studentSlice.reducer;
