import { createContext, useContext } from "react";
import type { UseFormReturn } from "react-hook-form";

export const FormContext = createContext<UseFormReturn | null>(null);

export function useForm() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useForm must be used inside <FormProvider>");
  return ctx;
}
