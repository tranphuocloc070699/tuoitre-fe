
//type for redux
export interface LocalState {
    tasks : Task[]
    isLoading:boolean
}

//type for every task(todo)
export interface Task {
    title:string;
    isDone:boolean;
    createdAt:Date
}

//type for response whenever fake api call finished
export interface TaskResponse{
    code:number;
    message:string;
    success:boolean;
    task?:Task;
    tasks?:Task[]
}


//type for add and edit task 
export interface TaskControllProps{
    title:string;
    //callback when finished(to make animation)
    onSuccess?:(title : string) => void
}

//type for task status changing
export interface CheckBoxChangeProps{
    title:string;
    checked:boolean
}

//type for sort filter task
export interface TaskFilterProps{
    search?:string;
    sort?:string;
    status?:string;
}