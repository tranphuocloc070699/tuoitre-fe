//format createdAt of task
export const dateFormat = (input : Date) =>{
  const date = new Date(input)
    const convertValue = `${date.getHours()}:${date.getMinutes()},  ${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;
  
   

      return convertValue;
}