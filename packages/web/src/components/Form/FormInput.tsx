import { type ChangeEvent, forwardRef, type ReactNode, useId } from "react";
import { Input } from "components/input";
import { Label } from "components/label";
import { capitalized } from "@am-crm/shared";

interface FormFieldProps {
  name: string;
  type: string;
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  options?: string[];
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const FormField = forwardRef<HTMLInputElement | HTMLSelectElement, FormFieldProps>(
  (
    { name, label = capitalized(name), type, placeholder, value, defaultValue, onChange, required, disabled, options },
    ref,
  ) => {
    const id = useId();

    let control: ReactNode;
    switch (type) {
      case "select":
        if (!options) throw new Error("Options are required for select fields");
        control = (
          <select
            id={id}
            name={name}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            required={required}
            disabled={disabled}
            ref={ref as React.Ref<HTMLSelectElement>}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm
            transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium
            placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1
            focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
        break;
      default:
        control = (
          <Input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            required={required}
            disabled={disabled}
            ref={ref as React.Ref<HTMLInputElement>}
          />
        );
    }

    return (
      <div className="space-y-2">
        <Label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </Label>
        {control}
      </div>
    );
  },
);
