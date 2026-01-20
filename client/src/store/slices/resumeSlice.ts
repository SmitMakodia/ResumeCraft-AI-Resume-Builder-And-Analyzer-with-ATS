import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ResumeState, Resume } from '../../types';
import api from '../../lib/axios';

export const fetchResumes = createAsyncThunk('resume/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/resumes');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const fetchResumeById = createAsyncThunk('resume/fetchOne', async (id: string, { rejectWithValue }) => {
  try {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const createResume = createAsyncThunk('resume/create', async (title: string, { rejectWithValue }) => {
  try {
    const response = await api.post('/resumes/create', { title });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const updateResume = createAsyncThunk('resume/update', async (formData: FormData, { rejectWithValue }) => {
  try {
    const response = await api.put('/resumes/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.resume;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const deleteResume = createAsyncThunk('resume/delete', async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(`/resumes/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

const initialState: ResumeState = {
  resumes: [],
  currentResume: null,
  isLoading: false,
  error: null,
  isSaving: false,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    updateCurrentResumeLocal: (state, action: PayloadAction<Partial<Resume>>) => {
      if (state.currentResume) {
        state.currentResume = { ...state.currentResume, ...action.payload };
      }
    },
    clearCurrentResume: (state) => {
        state.currentResume = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchResumes.pending, (state) => { state.isLoading = true; })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumes = action.payload;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch One
      .addCase(fetchResumeById.pending, (state) => { state.isLoading = true; })
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentResume = action.payload;
      })
      // Update
      .addCase(updateResume.pending, (state) => { state.isSaving = true; })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.isSaving = false;
        state.currentResume = action.payload;
        // Update in list as well
        const index = state.resumes.findIndex(r => r._id === action.payload._id);
        if (index !== -1) state.resumes[index] = action.payload;
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createResume.fulfilled, (state, action) => {
        state.resumes.push(action.payload);
      })
      // Delete
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter(r => r._id !== action.payload);
      });
  },
});

export const { updateCurrentResumeLocal, clearCurrentResume } = resumeSlice.actions;
export default resumeSlice.reducer;
