import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay: number, initialValue?: T) => {
  const [debouncedValue, setDebouncedValue] = useState(initialValue ?? value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export function useDebouncedState<T>(
  initialValue: T,
  delay: number = 300
): [T, Dispatch<SetStateAction<T>>, T] {
  const [value, setValue] = useState<T>(initialValue);
  const debouncedValue = useDebounce(value, delay);
  return [value, setValue, debouncedValue];
}
