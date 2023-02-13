import { EditOutlined } from "@ant-design/icons";
import { Input, Modal } from "antd";
import clsx from "clsx";
import React, { memo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../../storing/hook";
import { editTask } from "../../../storing/reducers/localSlice";
import { TaskControllProps, TaskResponse } from "../../../types/local";
import styles from "../TodoList/styles.module.scss";

const EditTask = ({ title, onSuccess }: TaskControllProps) => {
  const dispatch = useAppDispatch();
  //Variables**********************************************
   //state of edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  //get query params for sort and select task
  const [queryParams, _] = useSearchParams({});

  //to display error if problem happen
  const [error, setError] = useState("");
  //state of new title
  const [editTitle, setEditTitle] = useState(title);

 
 //control edit modal
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setError("");
    setIsModalOpen(false);
  };
 
  //handle edit task
  const handleOk = async () => {
    let obj: { [k: string]: any } = {};
    queryParams.forEach((value, key) => {
      obj[key] = value;
    });
    let sort = "";
    let status = "";
    if (obj.sort) sort = obj.sort;
    if (obj.status) status = obj.status;
    if(editTitle.trim().length<1){
      setError('Title must be more than 1 characters')
      return;
    }
    const result = await dispatch(editTask({ title, editTitle, sort, status }));
    const payload: TaskResponse = result.payload as TaskResponse;
    if (!payload.success) {
      setError(payload.message);
      return;
    }

    onSuccess!(editTitle);

    setError("");
    setEditTitle("");
    setIsModalOpen(false);
  };

 
  return (
    <div>
      <EditOutlined
        className={clsx(styles.icon, styles.editIcon)}
        onClick={showModal}
      />
      <Modal
        title="Edit Task"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className={clsx(styles.errorMessage,error.length<1 && styles.hidden)}> 
        <span >Error: {error}</span>
        </div>
        <p className={styles.addTaskTitle}>Task Title</p>

        <Input
          placeholder="Enter something..."
          style={{ marginBottom: 30 }}
          name="title"
          value={editTitle}
          onChange={(e) => {
            if (error.length > 0) {
              setError("");
            }
            setEditTitle(e.target.value);
          }}
        />
      </Modal>
    </div>
  );
};

export default memo(EditTask);
