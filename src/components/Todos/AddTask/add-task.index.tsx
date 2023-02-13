import { Button, Input, Modal } from "antd";
import clsx from "clsx";
import React, { memo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../../storing/hook";
import { addNewTask } from "../../../storing/reducers/localSlice";
import { TaskResponse } from "../../../types/local";
import styles from "../TodoList/styles.module.scss";


const AddTask = ({onSuccess} : {onSuccess : (title : string) => void}) => {

  const dispatch = useAppDispatch()
   //Variables**********************************************
   //state of add modal
   const [isModalOpen, setIsModalOpen] = useState(false);

   //get query params for sort and select task
   const [queryParams, setQueryParams] = useSearchParams({});

   //to display error if problem happen
  const [error,setError] = useState('')

  //state of title for add
  const [title,setTitle] = useState('')

 //control add modal
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setTitle('')
    setError('')
  };

  //handle add task
  const handleOk = async () => {
    setError('');
    if(title.trim().length<1){
      setError('Title must be more than 1 characters')
      return;
    }
    const result = await  dispatch(addNewTask(title))
    const payload : TaskResponse = result.payload as TaskResponse
 
    if(!payload.success){
      setError(payload.message)
      return;
    }
    if(payload.task){
      onSuccess(payload.task.title)
    }
    let obj: {[k: string]: any} = {};
    queryParams.forEach((value, key) => {
      obj[key] = value;
    });
    if(obj.status!=='all'){
      setQueryParams({
        ...obj,
        status:'all'
      })
    }
    setIsModalOpen(false);
    setTitle('')
    setError('')
  };


  return (
    <div>
      <Button
        shape="round"
        type="primary"
        className={styles.addTaskBtn}
        onClick={showModal}
      >
        Add Task
      </Button>
      <Modal
        title="Add new task"
        open={isModalOpen}
        
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className={clsx(styles.errorMessage,error.length<1 && styles.hidden)}> 
        <span >Error: {error}</span>
        </div>
        <p className={styles.addTaskTitle}>Task Title</p>
        <Input placeholder="Enter something..." style={{marginBottom:30}} value={title} onChange={(e) => {
          setTitle(e.target.value)
          if(error.length>0){
            setError('')
          }
        }} />
      </Modal>
    </div>
  );
};

export default memo(AddTask);
