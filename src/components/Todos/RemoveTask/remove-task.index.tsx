import { DeleteOutlined } from "@ant-design/icons";
import { Modal, message } from "antd";
import clsx from "clsx";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../../storing/hook";
import { removeTask } from "../../../storing/reducers/localSlice";
import { TaskControllProps } from "../../../types/local";
import styles from "../TodoList/styles.module.scss";
const RemoveTask = ({ title }: TaskControllProps) => {
  const dispatch = useAppDispatch();
  //Variables**********************************************
  //state of remove modal
  const [isModalOpen, setIsModalOpen] = useState(false);
//get query params for sort and select task
  const [queryParams, _] = useSearchParams({});

  //display message when remove task successfully
  const [messageApi, contextHolder] = message.useMessage();

  //control remove modal
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //handle remove task
  const handleOk = async () => {
    let obj: { [k: string]: any } = {};
    queryParams.forEach((value, key) => {
      obj[key] = value;
    });
    let sort = "";
    let status = "";
    if (obj.sort) sort = obj.sort;
    if (obj.status) status = obj.status;
    messageApi.success(`Delete ${title} successfully!`);
    await dispatch(removeTask({ title, sort, status }));
    setIsModalOpen(false);
  };

 
  return (
    <div>
      {contextHolder}
      <DeleteOutlined
        className={clsx(styles.icon, styles.deleteIcon)}
        onClick={showModal}
      />
      <Modal
        title="Remove Task"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <h3>Do you really want to remove {title} job?</h3>
      </Modal>
    </div>
  );
};

export default RemoveTask;
