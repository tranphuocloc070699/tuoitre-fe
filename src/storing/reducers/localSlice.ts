import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import {
  CheckBoxChangeProps,
  LocalState,
  TaskFilterProps,
  TaskResponse,
} from "../../types/local";
import TaskApi from "../../api/task";

const initialState: LocalState = {
  tasks: [],
  isLoading: true,
};

export const addNewTask = createAsyncThunk(
  "addNewTask",
  async (title: string) => {
    return await TaskApi.addNewTask(title);
  }
);

export const getTasks = createAsyncThunk("getTasks", async () => {
  return await TaskApi.getTasks();
});

export const editTask = createAsyncThunk(
  "editTask",
  async ({
    title,
    editTitle,
    sort,
    status,
  }: {
    title: string;
    editTitle: string;
    sort: string;
    status: string;
  }) => {
    return await TaskApi.editTask(title, editTitle, sort, status);
  }
);

export const removeTask = createAsyncThunk(
  "removeTask",
  async ({
    title,
    sort,
    status,
  }: {
    sort: string;
    title: string;
    status: string;
  }) => {
    return await TaskApi.removeTask(title, sort, status);
  }
);

export const editTaskStatus = createAsyncThunk(
  "editTaskStatus",
  async ({
    props,
    status,
    sort,
  }: {
    props: CheckBoxChangeProps;
    status: string;
    sort: string;
  }) => {
    return await TaskApi.editTaskStatus({ props, status, sort });
  }
);

export const taskSearcher = createAsyncThunk(
  "taskSearcher",
  async (props: TaskFilterProps) => {
    return await TaskApi.taskSearcher(props);
  }
);
export const taskSorter = createAsyncThunk(
  "taskSorter",
  async (props: TaskFilterProps) => {
    return await TaskApi.taskSorter(props);
  }
);
const localSlice = createSlice({
  name: "localSlice",
  initialState,
  reducers: {
    orderTasks(state, action) {
      state.tasks = action.payload;
      localStorage.setItem("tasks", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    //Get task
    builder.addCase(getTasks.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getTasks.fulfilled, (state, action) => {
      state.isLoading = false;
      const result = action.payload as TaskResponse;
      if (result.success && result.tasks) {
        state.tasks = result.tasks;
      }
    });
    //Add new task
    builder.addCase(addNewTask.pending, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(addNewTask.fulfilled, (state, action) => {
      const result = action.payload as TaskResponse;
      const temp = state.tasks.map((item) => item);
      if (result.success && result.task) {
        temp.push(result.task);
        state.tasks = temp;
      }
    });
    //Edit task
    builder.addCase(editTask.pending, (state, action) => {});
    builder.addCase(editTask.fulfilled, (state, action) => {
      const result = action.payload as TaskResponse;
      if (result.success && result.tasks) {
        state.tasks = result.tasks;
      }
    });
    //Remove task
    builder.addCase(removeTask.pending, (state, action) => {});
    builder.addCase(removeTask.fulfilled, (state, action) => {
      const result = action.payload as TaskResponse;
      if (result.success && result.tasks) {
        state.tasks = result.tasks;
      }
    });
    //Edit task status(done or undone)
    builder.addCase(editTaskStatus.pending, (state, action) => {});
    builder.addCase(editTaskStatus.fulfilled, (state, action) => {
      const result = action.payload as TaskResponse;
      if (result.success && result.tasks) {
        state.tasks = result.tasks;
      }
    });

    //search task
    builder.addCase(taskSearcher.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(taskSearcher.fulfilled, (state, action) => {
      state.isLoading = false;
      const result = action.payload as TaskResponse;
      if (result.success && result.tasks) {
        state.tasks = result.tasks;
      }
    });

    //sort or select task
    builder.addCase(taskSorter.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(taskSorter.fulfilled, (state, action) => {
      state.isLoading = false;
      const result = action.payload as TaskResponse;
      if (result.success && result.tasks) {
        state.tasks = result.tasks;
      }
    });
  },
});

const localReducer = localSlice.reducer;
export const localSelector = (state: RootState) => state.local;
export const { orderTasks } = localSlice.actions;

export default localReducer;
