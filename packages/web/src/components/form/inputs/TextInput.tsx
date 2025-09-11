import { Input } from "components/shad/input";
import type { ReactNode } from "react";

interface TextInputProps {
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  // biome-ignore lint/suspicious/noExplicitAny: Field type from react-hook-form
  field: any;
}

export const TextInput = ({
  name,
  type = "text",
  placeholder,
  defaultValue,
  onChange,
  required,
  disabled,
  field,
}: TextInputProps): ReactNode => (
  <Input
    name={name}
    type={type}
    placeholder={placeholder}
    defaultValue={defaultValue}
    autoComplete="on"
    onInput={onChange && ((e) => onChange(e.currentTarget.value))}
    required={required}
    disabled={disabled}
    {...field}
  />
);
