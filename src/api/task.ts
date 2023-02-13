import {
  CheckBoxChangeProps,
  Task,
  TaskFilterProps,
  TaskResponse,
} from "../types/local";

const TaskApi = () => {
  //declare key LocalStorage
  const LOCAL_TASKS_NAME = "tasks";

  //to fake api (create delay)
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const getTasks = async (): Promise<TaskResponse> => {
    await sleep(1000);
    const valueFromLocal = localStorage.getItem(LOCAL_TASKS_NAME);
    if (valueFromLocal) {
      return {
        success: true,
        code: 200,
        message: "Get tasks successfully!",
        tasks: JSON.parse(valueFromLocal),
      };
    } else {
      return {
        success: true,
        code: 200,
        message: "No tasks!",
        tasks: [],
      };
    }
  };

  const addNewTask = async (title: string): Promise<TaskResponse> => {
    await sleep(100);
    const valueFromLocal = localStorage.getItem(LOCAL_TASKS_NAME);
    if (valueFromLocal) {
      let tasks = JSON.parse(valueFromLocal) as Task[];
      const index = tasks.findIndex((item) => item.title === title);
      if (index !== -1) {
        return {
          success: false,
          code: 400,
          message: "Task already Exist",
        };
      }
      const newTask: Task = {
        title,
        isDone: false,
        createdAt: new Date(),
      };
      tasks.push(newTask);
      localStorage.setItem(LOCAL_TASKS_NAME, JSON.stringify(tasks));

      return {
        success: true,
        code: 200,
        message: "Add task successfully!",
        task: newTask,
      };
    } else {
      const newTask: Task = {
        title,
        isDone: false,
        createdAt: new Date(),
      };
      localStorage.setItem(LOCAL_TASKS_NAME, JSON.stringify([newTask]));

      return {
        success: true,
        code: 200,
        message: "Add task successfully!",
        task: newTask,
      };
    }
  };

  const editTask = async (
    title: string,
    editTitle: string,
    sort: string,
    status: string
  ): Promise<TaskResponse> => {
    await sleep(100);
    const valueFromLocal = localStorage.getItem(LOCAL_TASKS_NAME);
    if (valueFromLocal) {
      let tasks = JSON.parse(valueFromLocal) as Task[];
      const index = tasks.findIndex((item) => item.title === title);
      if (index === -1) {
        return {
          success: false,
          code: 404,
          message: "Task not found",
          tasks: [],
        };
      }

      tasks[index].title = editTitle;

      localStorage.setItem(LOCAL_TASKS_NAME, JSON.stringify(tasks));
      let result: Task[] = [...tasks];
      if (sort.length > 0) {
        //Oldest -> Newest
        if (sort === "asc") {
          result = tasks.sort(function (a, b) {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        } else {
          //Newest -> Oldest
          result = tasks.sort(function (a, b) {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          });
        }
      }
      if (status.length > 0) {
        switch (status) {
          case "done":
            result = tasks.filter((item) => item.isDone);
            break;
          case "undone":
            result = tasks.filter((item) => !item.isDone);
            break;
          default:
            result = [...tasks];
            break;
        }
      }
      return {
        success: true,
        code: 200,
        message: "Update tasks successfully!",
        tasks: result,
      };
    } else {
      return {
        success: false,
        code: 404,
        message: "Task not found",
        tasks: [],
      };
    }
  };

  const removeTask = async (
    title: string,
    sort: string,
    status: string
  ): Promise<TaskResponse> => {
    await sleep(500);
    const valueFromLocal = localStorage.getItem(LOCAL_TASKS_NAME);
    if (valueFromLocal) {
      const tasks = JSON.parse(valueFromLocal) as Task[];
      const index = tasks.findIndex((item) => item.title === title);
      if (index === -1) {
        return {
          success: false,
          code: 404,
          message: "Task not found",
          tasks: [],
        };
      }

      tasks.splice(index, 1);

      localStorage.setItem(LOCAL_TASKS_NAME, JSON.stringify(tasks));

      let result: Task[] = [...tasks];
      if (sort.length > 0) {
        //Oldest -> Newest
        if (sort === "asc") {
          result = tasks.sort(function (a, b) {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        } else {
          //Newest -> Oldest
          result = tasks.sort(function (a, b) {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          });
        }
      }
      if (status.length > 0) {
        switch (status) {
          case "done":
            result = tasks.filter((item) => item.isDone);
            break;
          case "undone":
            result = tasks.filter((item) => !item.isDone);
            break;
          default:
            result = [...tasks];
            break;
        }
      }

      return {
        success: true,
        code: 200,
        message: "Remove tasks successfully!",
        tasks: result,
      };
    } else {
      return {
        success: false,
        code: 404,
        message: "Task not found",
        tasks: [],
      };
    }
  };

  //changing task status(done or undone)
  const editTaskStatus = async ({
    props,
    status,
    sort,
  }: {
    props: CheckBoxChangeProps;
    status: string;
    sort: string;
  }): Promise<TaskResponse> => {
    await sleep(5);
    const valueFromLocal = localStorage.getItem(LOCAL_TASKS_NAME);
    if (valueFromLocal) {
      const tasks = JSON.parse(valueFromLocal) as Task[];
      const index = tasks.findIndex((item) => item.title === props.title);
      if (index === -1) {
        return {
          success: false,
          code: 404,
          message: "Task not found",
          tasks: [],
        };
      }
      if (tasks[index].isDone !== props.checked) {
        tasks[index].isDone = props.checked;
      }
      localStorage.setItem(LOCAL_TASKS_NAME, JSON.stringify(tasks));
      let result: Task[] = [...tasks];
      if (sort.length > 0) {
        //Oldest -> Newest
        if (sort === "asc") {
          result = tasks.sort(function (a, b) {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        } else {
          //Newest -> Oldest
          result = tasks.sort(function (a, b) {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          });
        }
      }

      if (status.length > 0) {
        switch (status) {
          case "done":
            result = tasks.filter((item) => item.isDone);
            break;
          case "undone":
            result = tasks.filter((item) => !item.isDone);
            break;
          default:
            result = [...tasks];
            break;
        }
      }
      return {
        success: true,
        code: 200,
        message: "Edit task status successfully!",
        tasks: result,
      };
    } else {
      return {
        success: false,
        code: 404,
        message: "Task not found",
        tasks: [],
      };
    }
  };

  //search task
  const taskSearcher = async (
    props: TaskFilterProps
  ): Promise<TaskResponse> => {
    await sleep(500);

    const valueFromLocal = localStorage.getItem(LOCAL_TASKS_NAME);
    if (valueFromLocal) {
      const tasks = JSON.parse(valueFromLocal) as Task[];
      let result: Task[] = [];
      if (props.search && props.search.length > 0) {
        result = tasks.filter((item) =>
          item.title.toUpperCase().includes(props.search!.toUpperCase() || "")
        );
      } else {
        result = [...tasks];
      }
 
      return {
        success: true,
        code: 200,
        message: "Get tasks successfully!",
        tasks: result,
      };
    } else {
      return {
        success: true,
        code: 200,
        message: "No tasks!",
        tasks: [],
      };
    }
  };

  //sort and filter task
  const taskSorter = async (props: TaskFilterProps): Promise<TaskResponse> => {
    await sleep(500);
    const valueFromLocal = localStorage.getItem(LOCAL_TASKS_NAME);
    if (valueFromLocal) {
      const tasks = JSON.parse(valueFromLocal) as Task[];
      let result: Task[] = [];
      if (props.sort) {
        //Oldest -> Newest
        if (props.sort === "asc") {
          result = tasks.sort(function (a, b) {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        } else {
          //Newest -> Oldest
          result = tasks.sort(function (a, b) {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          });
        }
      }
      if (props.status) {
        switch (props.status) {
          case "done":
            result = tasks.filter((item) => item.isDone);
            break;
          case "undone":
            result = tasks.filter((item) => !item.isDone);
            break;
          default:
            result = [...tasks];
            break;
        }
      }

      return {
        success: true,
        message: "Sorting successfully!",
        code: 200,
        tasks: result,
      };
    } else {
      return {
        success: true,
        code: 200,
        message: "No tasks!",
        tasks: [],
      };
    }
  };

  return {
    addNewTask,
    getTasks,
    editTask,
    removeTask,
    editTaskStatus,
    taskSearcher,
    taskSorter,
  };
};

export default TaskApi();
