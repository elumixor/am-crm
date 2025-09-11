import { Textarea } from "components/shad/textarea";
import type { ReactNode } from "react";

interface TextareaInputProps {
  name: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  rows?: number;
  // biome-ignore lint/suspicious/noExplicitAny: Field type from react-hook-form
  field: any;
}

export const TextareaInput = ({
  name,
  placeholder,
  defaultValue,
  onChange,
  required,
  disabled,
  rows = 3,
  field,
}: TextareaInputProps): ReactNode => (
  <Textarea
    name={name}
    placeholder={placeholder}
    defaultValue={defaultValue}
    onInput={onChange && ((e) => onChange(e.currentTarget.value))}
    required={required}
    disabled={disabled}
    rows={rows}
    {...field}
  />
);
