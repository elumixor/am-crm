"use client";

import { useCallback, useEffect, useState } from "react";

export function useRetrieved<T extends { id: string }>(fetchFn?: (id: string) => Promise<T | null>) {
  const [retrievedObj, setRetrievedObj] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const setId = useCallback((id: string | null) => {
    setCurrentId(id);
  }, []);

  const updateObj = useCallback((updatedObj: T) => {
    setRetrievedObj(updatedObj);
  }, []);

  useEffect(() => {
    if (!currentId || !fetchFn) {
      setRetrievedObj(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    void (async () => {
      try {
        const data = await fetchFn(currentId);
        setRetrievedObj(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setRetrievedObj(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [currentId, fetchFn]);

  return {
    retrievedObj,
    isLoading,
    setId,
    updateObj,
  };
}
