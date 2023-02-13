
//format task's title
export const subString = (str : string,limit : number) =>{
  
    if(str.length>limit){
        return str.substring(0,limit).concat('...')
    }else{
        return str
    }
}