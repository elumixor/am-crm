import { useState } from "react";

export function useAsyncWithError<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
): [(...args: TArgs) => Promise<TResult>, string | null, boolean] {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const wrapped = async (...args: TArgs) => {
    try {
      setError(null);
      setIsLoading(true);
      const result = await fn(...args);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return [wrapped as (...args: TArgs) => Promise<TResult>, error, isLoading];
}
