import { Button, Select, Skeleton, Tooltip, message, Modal } from "antd";
import { memo, useEffect, useState } from "react";
import { dateFormat } from "../../../utils/dateFormat";
import styles from "./styles.module.scss";

import { SearchOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../../../storing/hook";
import {
  editTaskStatus,
  getTasks,
  localSelector,
  orderTasks,
  taskSearcher,
  taskSorter,
} from "../../../storing/reducers/localSlice";
import noDataImg from "../../../assets/no-data-found.png";
import AddTask from "../AddTask/add-task.index";
import EditTask from "../EditTask/edit-task.index";

import { useSearchParams } from "react-router-dom";
import { CheckBoxChangeProps } from "../../../types/local";
import useDebounced from "../../../utils/useDebound";
import RemoveTask from "../RemoveTask/remove-task.index";
import { useMediaQuery } from "react-responsive";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { subString } from "../../../utils/subString";
const TodoList = () => {
  //Variables*********************************************************************

  const dispatch = useAppDispatch();
  //get state from redux
  const { tasks, isLoading } = useAppSelector(localSelector);

  //declare task's sort,selected state
  const [sortOrder, setSortOrder] = useState("desc"); // ascend, Descend
  const [selectedFilter, setSelectedFilter] = useState("all"); // all, done, undone

  //display message on call api finished
  const [messageApi, contextHolder] = message.useMessage();
  //get query params for sort and select task
  const [queryParams, setQueryParams] = useSearchParams({});

  //to handle open and close search input
  const [searchIsOpen, setSearchIsOpen] = useState(false);

  //to make animation on add task success
  const [addTaskSuccess, setAddTaskSuccess] = useState("");

  //to make animation on edit task success
  const [editTaskSuccess, setEditTaskSuccess] = useState("");

  //to display complete title(cause title is hidden whenever length more than 50 characters)
  const [selectedTitle, setSelectedTitle] = useState("");

  //state for selected title modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  //to storing search value
  const [searchTerm, setSearchTerm] = useState("");

  //to storing value of search(cause useDebounced required this variable)
  let conditionText = useDebounced(searchTerm, 500);

  //for responsive
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  //useEffect*********************************************************************

  //get tasks on component mount
  useEffect(() => {
    let obj: { [k: string]: any } = {};
    queryParams.forEach((value, key) => {
      obj[key] = value;
    });
    if (Object.keys(obj).length === 0) {
      const getTasksApi = async () => {
        await dispatch(getTasks());
      };
      getTasksApi();
    }
  }, []);

  //useDebound
  //call api after search input changing complete 0.5s(utils/useDebound.ts)
  useEffect(() => {
    if (searchIsOpen) {
      const getTasks = async () => {
        await dispatch(
          taskSearcher({
            search: conditionText,
          })
        );
      };
      getTasks();
    }
  }, [conditionText]);

  //get and set query params(for sorting and selecting task)
  useEffect(() => {
    let obj: { [k: string]: any } = {};
    queryParams.forEach((value, key) => {
      obj[key] = value;
    });
    if (Object.keys(obj).length > 0) {
      if (obj.sort) {
        setSortOrder(obj.sort);
      }
      if (obj.status) {
        setSelectedFilter(obj.status);
      }
      const getTaskSorter = async () => {
        await dispatch(taskSorter(obj));
      };
      getTaskSorter();
    }
  }, [queryParams]);

  //Make animation on add task success
  useEffect(() => {
    let timeoutId = setTimeout(() => {
      setAddTaskSuccess("");
    }, 1200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [addTaskSuccess]);

  //Make animation on edit task success
  useEffect(() => {
    let timeoutId = setTimeout(() => {
      setEditTaskSuccess("");
    }, 1200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [editTaskSuccess]);

  //Function*****************************************************

  //Display completed title on select
  const showSelectedTitleModal = (title: string) => {
    setSelectedTitle(title);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //handle sectecting task
  const handleTaskStatusChange = (value: string) => {
    setSearchIsOpen(false);
    setSearchTerm("");
    let obj: { [k: string]: any } = {};
    queryParams.forEach((value, key) => {
      obj[key] = value;
    });
    setQueryParams({
      ...obj,
      status: value,
    });
  };

  //handle sorting task
  const handleTaskSorting = (value: string) => {
    setSearchIsOpen(false);
    setSearchTerm("");
    let obj: { [k: string]: any } = {};
    queryParams.forEach((value, key) => {
      obj[key] = value;
    });
    setQueryParams({
      ...obj,
      sort: value,
    });
  };

  //callback when task added successfully
  const handleAddTaskSuccess = (title: string) => {
    setAddTaskSuccess(title);
  };
  //callback when task edited successfully
  const handleEditTaskSuccess = (title: string) => {
    setEditTaskSuccess(title);
  };

  //handle task status changing(checkbox nearby title)
  const onCheckBoxChange = async (props: CheckBoxChangeProps) => {
    setSearchIsOpen(false);
    setSearchTerm("");
    let obj: { [k: string]: any } = {};
    queryParams.forEach((value, key) => {
      obj[key] = value;
    });
    let status = "";
    let sort = "";
    if (obj.status) status = obj.status;
    if (obj.sort) sort = obj.sort;
    await dispatch(editTaskStatus({ props, status, sort }));
    let taskStatus = props.checked ? "done" : "undone";
    messageApi.success(`${props.title} is ${taskStatus}`);
  };

  //handle drag and drog task
  const handleDragEnd = (result: DropResult) => {
    //if task is drogged outside list
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    dispatch(orderTasks(items));
  };

  return (
    <div className="grid wide">
      <div className="row">
        <div className="col l-o-2 l-8 m-o-2 m-8 c-12">
          <Modal
            title="Completed title"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <p>{selectedTitle}</p>
          </Modal>
          {contextHolder}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <AddTask onSuccess={handleAddTaskSuccess} />
              <div className={styles.sorting}>
                Sorting:
                <Select
                  value={sortOrder}
                  className={styles.sortingSelect}
                  onChange={handleTaskSorting}
                  options={[
                    {
                      value: "asc",
                      label: "Newest",
                    },
                    { value: "desc", label: "Oldest" },
                  ]}
                />
              </div>
              {isDesktopOrLaptop && (
                <div className={styles.search}>
                  <Tooltip title="search">
                    <Button
                      shape="circle"
                      className={styles.searchBtn}
                      icon={<SearchOutlined />}
                      onClick={() => {
                        searchIsOpen
                          ? setSearchIsOpen(false)
                          : setSearchIsOpen(true);
                      }}
                    />
                  </Tooltip>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    style={
                      searchIsOpen
                        ? { transform: "scaleX(1)" }
                        : { transform: "scaleX(0)" }
                    }
                    placeholder="Enter task title"
                  />
                </div>
              )}
            </div>
            <div className={styles.headerRight}>
              <Select
                value={selectedFilter}
                className={styles.statusSelect}
                onChange={handleTaskStatusChange}
                options={[
                  {
                    value: "all",
                    label: "All",
                  },
                  { value: "done", label: "Done" },
                  { value: "undone", label: "Undone" },
                ]}
              />
            </div>
          </div>
          {/* For mobile */}
          {!isDesktopOrLaptop && (
            <div className={clsx(styles.search, styles.searchOnMobile)}>
              <Tooltip title="search">
                <Button
                  shape="circle"
                  className={styles.searchBtn}
                  icon={<SearchOutlined />}
                  onClick={() => {
                    searchIsOpen
                      ? setSearchIsOpen(false)
                      : setSearchIsOpen(true);
                  }}
                />
              </Tooltip>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                style={
                  searchIsOpen
                    ? { transform: "scaleX(1)" }
                    : { transform: "scaleX(0)" }
                }
                placeholder="Enter task title"
              />
            </div>
          )}

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="task">
              {(provided) => (
                <div
                  className={clsx(
                    styles.totoList,
                    tasks.length === 0 && styles.emptyList
                  )}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {isLoading ? (
                    <div className={styles.loader}>
                      <Skeleton active />
                      <Skeleton active />
                      <Skeleton active />
                    </div>
                  ) : tasks.length > 0 ? (
                    tasks.map((item, index) => (
                      <Draggable
                        key={item.title}
                        draggableId={item.title}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className={clsx(
                              styles.todoItem,
                              addTaskSuccess === item.title &&
                                styles.onAddSuccess,
                              editTaskSuccess === item.title &&
                                styles.onEditSuccess
                            )}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className={styles.itemInfo}>
                              <input
                                value={item.title}
                                type="checkbox"
                                className={styles.checkbox}
                                checked={item.isDone}
                                onChange={(e) => {
                                  onCheckBoxChange({
                                    title: e.target.value,
                                    checked: e.target.checked,
                                  });
                                }}
                              />

                              <div
                                className={clsx(item.isDone && styles.itemDone)}
                              >
                                <h4
                                  onClick={() => {
                                    showSelectedTitleModal(item.title);
                                  }}
                                >
                                  {subString(item.title, 50)}
                                </h4>
                                <p className={styles.createdAt}>
                                  {dateFormat(item.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className={styles.itemController}>
                              <RemoveTask title={item.title} />
                              <EditTask
                                title={item.title}
                                onSuccess={handleEditTaskSuccess}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <div className={styles.empty}>
                      <img src={noDataImg} />
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default memo(TodoList);
