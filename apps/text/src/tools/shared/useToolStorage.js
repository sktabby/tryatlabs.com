import { useEffect, useState } from "react";

export function useToolStorage(key, initialValue = "") {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? saved : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }, [key, value]);

  return [value, setValue];
}
