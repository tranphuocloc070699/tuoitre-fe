import { useEffect, useState } from "react";

//for search task
const useDebounced = (value: string, timeout: number) => {
  let [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    let timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, timeout);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, timeout]);

  return debouncedValue;
};

export default useDebounced;
