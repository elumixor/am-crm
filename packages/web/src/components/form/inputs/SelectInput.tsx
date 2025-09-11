import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/shad/select";
import type { ReactNode } from "react";

interface SelectInputProps {
  placeholder?: string;
  disabled?: boolean;
  options: string[] | { value: string; label: string }[];
  onChange?: (value: string) => void;
  // biome-ignore lint/suspicious/noExplicitAny: Field type from react-hook-form
  field: any;
}

export const SelectInput = ({ placeholder, disabled, options, onChange, field }: SelectInputProps): ReactNode => (
  <Select
    disabled={disabled}
    value={field.value}
    onValueChange={(value) => {
      field.onChange(value);
      onChange?.(value);
    }}
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder={placeholder || "Select an option"} />
    </SelectTrigger>
    <SelectContent>
      {options.map((option) => {
        const value = typeof option === "string" ? option : option.value;
        const label = typeof option === "string" ? option : option.label;
        return (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        );
      })}
    </SelectContent>
  </Select>
);
