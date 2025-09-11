import { capitalized } from "@am-crm/shared";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  FormField as ShadFormField,
} from "components/shad/form";
import { useForm } from "./FormContext";
import { TextInput, SelectInput, TextareaInput, DateInput } from "./inputs";

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
  onChange?: (value: string) => void;
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

  const renderInput = (field: object) => {
    switch (type) {
      case "select":
        if (!options) throw new Error("Options are required for select fields");
        return (
          <SelectInput
            placeholder={placeholder}
            disabled={disabled}
            options={options}
            onChange={onChange}
            field={field}
          />
        );
      case "textarea":
        return (
          <TextareaInput
            name={name}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChange={onChange}
            required={required}
            disabled={disabled}
            rows={rows}
            field={field}
          />
        );
      case "date":
        return <DateInput placeholder={placeholder} disabled={disabled} onChange={onChange} field={field} />;
      default:
        return (
          <TextInput
            name={name}
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChange={onChange}
            required={required}
            disabled={disabled}
            field={field}
          />
        );
    }
  };

  return (
    <ShadFormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>{renderInput(field)}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    ></ShadFormField>
  );
};
