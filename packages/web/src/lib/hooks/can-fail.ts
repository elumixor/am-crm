import { useState } from "react";

export function canFail<T>(fn: () => Promise<T>): [() => Promise<void>, string | null, boolean] {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const wrapped = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return [wrapped, error, isLoading];
}
