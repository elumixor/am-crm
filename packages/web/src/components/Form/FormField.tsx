import { capitalized } from "@am-crm/shared";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  FormField as ShadFormField,
} from "components/shad/form";
import { Input } from "components/shad/input";
import { Textarea } from "components/shad/textarea";
import type { FormEvent, ReactNode } from "react";
import { useForm } from "./FormContext";

type SupportedElement = HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement;

interface FormFieldProps {
  name: string;
  type?: string;
  label?: string;
  description?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  options?: string[] | { value: string; label: string }[];
  onChange?: (e: FormEvent<SupportedElement>) => void;
  rows?: number;
}

export const FormField = ({
  name,
  label = capitalized(name),
  description,
  type = "text",
  placeholder,
  defaultValue,
  onChange,
  required,
  disabled,
  options,
  rows = 3,
}: FormFieldProps) => {
  const form = useForm();

  let control: (field: object) => ReactNode;
  switch (type) {
    case "select":
      if (!options) throw new Error("Options are required for select fields");
      control = (field) => (
        <select
          name={name}
          defaultValue={defaultValue}
          onInput={onChange}
          required={required}
          disabled={disabled}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm
            transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium
            placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1
            focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          {...field}
        >
          {options.map((option) => {
            const value = typeof option === "string" ? option : option.value;
            const label = typeof option === "string" ? option : option.label;
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>
      );
      break;
    case "textarea":
      control = (field) => (
        <Textarea
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onInput={onChange}
          required={required}
          disabled={disabled}
          rows={rows}
          {...field}
        />
      );
      break;
    default:
      control = (field) => (
        <Input
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          autoComplete="on"
          onInput={onChange}
          required={required}
          disabled={disabled}
          {...field}
        />
      );
  }

  return (
    <ShadFormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>{control(field)}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    ></ShadFormField>
  );
};
